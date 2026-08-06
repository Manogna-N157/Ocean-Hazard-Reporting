const dns = require('dns').promises;
const net = require('net');

const inaccessible = (message) => Object.assign(new Error(`${message} Please paste the post text manually instead.`), { statusCode: 422, code: 'URL_CONTENT_UNAVAILABLE' });

const isPrivateIp = (address) => {
  if (net.isIP(address) === 4) return /^(10\.|127\.|0\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.)/.test(address);
  const value = address.toLowerCase();
  return value === '::1' || value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe80:');
};

const validatePublicUrl = async (value) => {
  let url;
  try { url = new URL(value); } catch { throw Object.assign(new Error('Enter a valid public HTTP(S) URL.'), { statusCode: 400 }); }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw Object.assign(new Error('Enter a valid public HTTP(S) URL.'), { statusCode: 400 });
  if (url.username || url.password || url.hostname === 'localhost') throw inaccessible('This URL is not publicly accessible.');
  try {
    const addresses = await dns.lookup(url.hostname, { all: true });
    if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) throw inaccessible('This URL is not publicly accessible.');
  } catch (error) {
    if (error.statusCode) throw error;
    throw inaccessible('The URL could not be resolved publicly.');
  }
  return url;
};

const htmlToText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
  .replace(/\s+/g, ' ').trim().slice(0, 12000);

const extractPublicPageText = async (value) => {
  let url = await validatePublicUrl(value);
  for (let redirectCount = 0; redirectCount < 5; redirectCount += 1) {
    let response;
    try { response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'OceanGuard/1.0 public-content-analyzer' } }); }
    catch { throw inaccessible('The page could not be accessed.'); }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) throw inaccessible('The page redirected without a valid destination.');
      url = await validatePublicUrl(new URL(location, url).toString());
      continue;
    }
    if (!response.ok) throw inaccessible(`The page returned HTTP ${response.status}.`);
    if (!response.headers.get('content-type')?.includes('text/html')) throw inaccessible('The URL does not provide readable public HTML content.');
    const text = htmlToText(await response.text());
    if (text.length < 30) throw inaccessible('No readable public post text was found on this page.');
    return { originalUrl: url.toString(), extractedText: text };
  }
  throw inaccessible('The page redirected too many times.');
};

module.exports = { extractPublicPageText };
