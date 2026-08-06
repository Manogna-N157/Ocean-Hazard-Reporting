const { GoogleGenAI, Type, ApiError } = require('@google/genai');

const HAZARD_TYPES = [
  'Oil Spill',
  'Plastic Pollution',
  'Cyclone Damage',
  'High Waves',
  'Marine Animal Death',
  'Coastal Flooding',
  'Ship Accident',
  'Other',
];
const SEVERITIES = ['Low', 'Medium', 'High'];

/** Currently supported model for vision + structured JSON (Aug 2026). */
const DEFAULT_MODEL = 'gemini-3.6-flash';

/** Retired or unavailable models — always mapped to DEFAULT_MODEL. */
const RETIRED_MODELS = new Set([
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-lite-001',
]);

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    hazard_type: { type: Type.STRING, enum: HAZARD_TYPES },
    confidence: { type: Type.NUMBER },
    severity: { type: Type.STRING, enum: SEVERITIES },
    explanation: { type: Type.STRING },
    recommended_action: { type: Type.STRING },
  },
  required: ['hazard_type', 'confidence', 'severity', 'explanation', 'recommended_action'],
};

const SOCIAL_HAZARD_TYPES = [...HAZARD_TYPES, 'None'];
const SOCIAL_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    hazard_type: { type: Type.STRING, enum: SOCIAL_HAZARD_TYPES },
    summary: { type: Type.STRING },
    confidence_score: { type: Type.NUMBER },
    risk_level: { type: Type.STRING, enum: SEVERITIES },
    recommendation: { type: Type.STRING },
    should_investigate: { type: Type.BOOLEAN },
  },
  required: ['hazard_type', 'summary', 'confidence_score', 'risk_level', 'recommendation', 'should_investigate'],
};

const PROMPT =
  'Analyze this ocean or coastal image for a possible environmental hazard. Return one hazard type, confidence from 0 to 100, severity, a concise explanation of visible evidence, and one short practical action for coastal authorities. If the image is unclear, use Other with lower confidence. Return JSON only.';

let genaiClient = null;

const normalizeModelName = (model) => String(model || '').trim().replace(/^models\//i, '').toLowerCase();

const resolveModel = () => {
  const configured = normalizeModelName(process.env.GEMINI_MODEL || DEFAULT_MODEL);
  if (RETIRED_MODELS.has(configured)) {
    console.warn(`[Gemini] Model "${configured}" is retired or unavailable; using "${DEFAULT_MODEL}".`);
    return DEFAULT_MODEL;
  }
  return configured || DEFAULT_MODEL;
};

const getModelsToTry = () => [...new Set([resolveModel(), DEFAULT_MODEL])];

const getClient = () => {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    const error = new Error('GEMINI_API_KEY is not configured on the server.');
    error.statusCode = 503;
    error.code = 'GEMINI_NOT_CONFIGURED';
    throw error;
  }
  if (!genaiClient) {
    genaiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
  }
  return genaiClient;
};

const isModelNotFoundError = (error) => {
  if (error instanceof ApiError && error.status === 404) return true;
  const message = String(error?.message || '');
  return message.includes('NOT_FOUND') || message.includes('no longer available') || message.includes('"code": 404');
};

const formatGeminiError = (error) => {
  if (error?.statusCode) return error;

  if (error instanceof ApiError) {
    console.error('[Gemini] API error', { status: error.status, message: error.message });

    if (error.status === 404 || isModelNotFoundError(error)) {
      const modelError = new Error(
        `The Gemini model is unavailable. Update backend/.env to GEMINI_MODEL=${DEFAULT_MODEL} and restart the server.`,
      );
      modelError.statusCode = 502;
      modelError.code = 'GEMINI_MODEL_NOT_FOUND';
      return modelError;
    }

    if (error.status === 401 || error.status === 403) {
      const authError = new Error('Gemini API authentication failed. Verify GEMINI_API_KEY in backend/.env.');
      authError.statusCode = 502;
      authError.code = 'GEMINI_AUTH_FAILED';
      return authError;
    }

    if (error.status === 429) {
      const rateError = new Error('Gemini API rate limit reached. Please try again in a moment.');
      rateError.statusCode = 503;
      rateError.code = 'GEMINI_RATE_LIMIT';
      return rateError;
    }

    const apiError = new Error(`Gemini analysis failed: ${error.message}`);
    apiError.statusCode = 502;
    apiError.code = 'GEMINI_API_ERROR';
    return apiError;
  }

  const wrapped = new Error(error?.message || 'Gemini analysis failed unexpectedly.');
  wrapped.statusCode = error?.statusCode || 502;
  wrapped.code = error?.code || 'GEMINI_UNKNOWN_ERROR';
  return wrapped;
};

const parseJson = (text) => {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Gemini returned an empty analysis response.');
  }
  const json = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '').match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('Gemini did not return a JSON object.');
  try {
    return JSON.parse(json);
  } catch {
    throw new Error('Gemini returned invalid JSON.');
  }
};

const validateAnalysis = (result) => {
  if (!result || !HAZARD_TYPES.includes(result.hazard_type) || !SEVERITIES.includes(result.severity)) {
    throw new Error('Gemini returned an unsupported hazard analysis.');
  }
  const confidence = Number(result.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) {
    throw new Error('Gemini returned an invalid confidence value.');
  }
  if (typeof result.explanation !== 'string' || !result.explanation.trim()) {
    throw new Error('Gemini returned an invalid explanation.');
  }
  if (typeof result.recommended_action !== 'string' || !result.recommended_action.trim()) {
    throw new Error('Gemini returned an invalid recommended action.');
  }

  return {
    hazard_type: result.hazard_type,
    confidence: Math.round(confidence * 100) / 100,
    severity: result.severity,
    explanation: result.explanation.trim().slice(0, 1000),
    recommended_action: result.recommended_action.trim().slice(0, 500),
  };
};

const buildContents = (imageBuffer, mimeType) => [
  {
    role: 'user',
    parts: [
      { text: PROMPT },
      { inlineData: { mimeType, data: imageBuffer.toString('base64') } },
    ],
  },
];

const extractResponseText = (response) => {
  const text = response?.text?.trim();
  if (!text) throw new Error('Gemini returned an empty analysis response.');
  return text;
};

const generateAnalysis = async (client, model, imageBuffer, mimeType, useStructuredOutput) => {
  const request = {
    model,
    contents: buildContents(imageBuffer, mimeType),
  };

  if (useStructuredOutput) {
    request.config = {
      responseMimeType: 'application/json',
      responseJsonSchema: ANALYSIS_SCHEMA,
    };
  }

  const response = await client.models.generateContent(request);
  return parseJson(extractResponseText(response));
};

const analyzeWithModel = async (client, model, imageBuffer, mimeType) => {
  try {
    return validateAnalysis(await generateAnalysis(client, model, imageBuffer, mimeType, true));
  } catch (structuredError) {
    if (isModelNotFoundError(structuredError)) throw structuredError;

    console.warn('[Gemini] Structured output failed; retrying with plain-text JSON.', {
      model,
      message: structuredError.message,
    });

    return validateAnalysis(await generateAnalysis(client, model, imageBuffer, mimeType, false));
  }
};

const analyzeOceanHazardImage = async ({ imageBuffer, mimeType }) => {
  if (!imageBuffer?.length || !mimeType?.startsWith('image/')) {
    const error = new Error('A valid image is required for AI analysis.');
    error.statusCode = 400;
    error.code = 'INVALID_IMAGE';
    throw error;
  }

  const client = getClient();
  const modelsToTry = getModelsToTry();
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.info('[Gemini] Analyzing ocean hazard image', { model, mimeType, bytes: imageBuffer.length });
      return await analyzeWithModel(client, model, imageBuffer, mimeType);
    } catch (error) {
      lastError = error;
      if (isModelNotFoundError(error)) {
        console.warn(`[Gemini] Model "${model}" unavailable (404); trying fallback.`);
        continue;
      }

      console.error('[Gemini] Ocean hazard analysis failed.', {
        model,
        message: error.message,
        status: error instanceof ApiError ? error.status : undefined,
      });
      throw formatGeminiError(error);
    }
  }

  throw formatGeminiError(lastError || new Error('No supported Gemini model is available.'));
};

const validateSocialAnalysis = (result) => {
  const confidenceScore = Number(result?.confidence_score);
  if (!result || !SOCIAL_HAZARD_TYPES.includes(result.hazard_type) || !SEVERITIES.includes(result.risk_level)
    || !Number.isFinite(confidenceScore) || confidenceScore < 0 || confidenceScore > 100
    || typeof result.summary !== 'string' || !result.summary.trim()
    || typeof result.recommendation !== 'string' || !result.recommendation.trim()
    || typeof result.should_investigate !== 'boolean') {
    throw new Error('Gemini returned an invalid social-media analysis.');
  }

  if (result.hazard_type === 'None') {
    return {
      hazard_type: 'None', summary: result.summary.trim().slice(0, 1000), confidence_score: Math.round(confidenceScore * 100) / 100,
      risk_level: 'Low', recommendation: 'No action required.', should_investigate: false,
    };
  }

  return {
    hazard_type: result.hazard_type, summary: result.summary.trim().slice(0, 1000), confidence_score: Math.round(confidenceScore * 100) / 100,
    risk_level: result.risk_level, recommendation: result.recommendation.trim().slice(0, 500), should_investigate: result.should_investigate,
  };
};

const analyzeSocialMediaContent = async ({ text, imageBuffer, mimeType }) => {
  const hasText = typeof text === 'string' && text.trim();
  const hasImage = imageBuffer?.length && mimeType?.startsWith('image/');
  if (!hasText && !hasImage) {
    const error = new Error('Provide social-media text or a valid screenshot image.');
    error.statusCode = 400;
    throw error;
  }

  const prompt = `Analyze this manually supplied social-media ${hasImage ? 'screenshot' : 'post text'} for an ocean or coastal hazard. Return JSON only. Identify a real hazard only when supported by the content. For unrelated content use hazard_type None, risk_level Low, recommendation No action required., and should_investigate false. For hazards, give a concise summary, confidence_score from 0 to 100, risk_level, recommendation, and whether authorities should investigate.`;
  const contents = [{ role: 'user', parts: [{ text: hasText ? `${prompt}\n\nPost text:\n${text.trim()}` : prompt }] }];
  if (hasImage) contents[0].parts.push({ inlineData: { mimeType, data: imageBuffer.toString('base64') } });

  const client = getClient();
  let lastError;
  for (const model of getModelsToTry()) {
    try {
      const request = { model, contents, config: { responseMimeType: 'application/json', responseJsonSchema: SOCIAL_ANALYSIS_SCHEMA } };
      const response = await client.models.generateContent(request);
      return validateSocialAnalysis(parseJson(extractResponseText(response)));
    } catch (error) {
      lastError = error;
      if (isModelNotFoundError(error)) continue;
      throw formatGeminiError(error);
    }
  }
  throw formatGeminiError(lastError || new Error('No supported Gemini model is available.'));
};

module.exports = {
  analyzeOceanHazardImage,
  analyzeSocialMediaContent,
  DEFAULT_MODEL,
  RETIRED_MODELS,
};
