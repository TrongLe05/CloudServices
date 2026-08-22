const NAMED_ENTITIES: Record<string, string> = {
  // Vietnamese / Latin Accents
  "&aacute;": "á",
  "&agrave;": "à",
  "&acirc;": "â",
  "&atilde;": "ã",
  "&eacute;": "é",
  "&egrave;": "è",
  "&ecirc;": "ê",
  "&iacute;": "í",
  "&igrave;": "ì",
  "&oacute;": "ó",
  "&ograve;": "ò",
  "&ocirc;": "ô",
  "&otilde;": "õ",
  "&uacute;": "ú",
  "&ugrave;": "ù",
  "&yacute;": "ý",
  "&Aacute;": "Á",
  "&Agrave;": "À",
  "&Acirc;": "Â",
  "&Atilde;": "Ã",
  "&Eacute;": "É",
  "&Egrave;": "È",
  "&Ecirc;": "Ê",
  "&Iacute;": "Í",
  "&Igrave;": "Ì",
  "&Oacute;": "Ó",
  "&Ograve;": "Ò",
  "&Ocirc;": "Ô",
  "&Otilde;": "Õ",
  "&Uacute;": "Ú",
  "&Ugrave;": "Ù",
  "&Yacute;": "Ý",
  "&dstroke;": "đ",
  "&Dstroke;": "Đ",
  "&ccedil;": "ç",
  "&Ccedil;": "Ç",
  "&ntilde;": "ñ",
  "&Ntilde;": "Ñ",
  "&auml;": "ä",
  "&Auml;": "Ä",
  "&ouml;": "ö",
  "&Ouml;": "Ö",
  "&uuml;": "ü",
  "&Uuml;": "Ü",
  "&szlig;": "ß",
  "&aelig;": "æ",
  "&AElig;": "Æ",
  "&aring;": "å",
  "&Aring;": "Å",

  // Common HTML Special Characters & Punctuation
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&ndash;": "–",
  "&mdash;": "—",
  "&lsquo;": "‘",
  "&rsquo;": "’",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&bull;": "•",
  "&hellip;": "…",
  "&prime;": "′",
  "&Prime;": "″",
  "&cent;": "¢",
  "&pound;": "£",
  "&yen;": "¥",
  "&euro;": "€",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&deg;": "°",
  "&micro;": "µ",
  "&para;": "¶",
  "&middot;": "·",
  "&sup1;": "¹",
  "&sup2;": "²",
  "&sup3;": "³",
  "&frac14;": "¼",
  "&frac12;": "½",
  "&frac34;": "¾",
  "&times;": "×",
  "&divide;": "÷",
};

/**
 * Decodes all HTML entities (named, decimal numeric, and hex numeric)
 * Handles nested/double-encoded entities up to 3 passes.
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  let current = str;

  for (let i = 0; i < 3; i++) {
    const prev = current;

    // Decode decimal numeric entities e.g. &#7841; or &#226;
    current = current.replace(/&#(\d+);/g, (_, code) => {
      try {
        return String.fromCharCode(parseInt(code, 10));
      } catch {
        return _;
      }
    });

    // Decode hex numeric entities e.g. &#x1EA1; or &#xE2;
    current = current.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
      try {
        return String.fromCharCode(parseInt(code, 16));
      } catch {
        return _;
      }
    });

    // Decode named entities
    current = current.replace(/&[a-zA-Z0-9]+;/g, (match) => {
      return NAMED_ENTITIES[match] || NAMED_ENTITIES[match.toLowerCase()] || match;
    });

    if (current === prev) break;
  }

  return current;
}

/**
 * Strips HTML tags and decodes HTML entities to produce clean plain text excerpts.
 */
export function stripHtml(htmlString: string): string {
  if (!htmlString) return "";

  // 1. Decode entities first (so tags like &lt;p&gt; become <p>)
  let text = decodeHtmlEntities(htmlString);

  // 2. Remove HTML tags (<p>, <div>, <img...>, etc.)
  text = text.replace(/<[^>]*>?/gm, " ");

  // 3. Decode any leftover entities
  text = decodeHtmlEntities(text);

  // 4. Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Formats HTML content for dangerouslySetInnerHTML rendering.
 * Decodes entity-escaped HTML markup while preserving HTML tags.
 */
export function formatHtmlContent(htmlString: string): string {
  if (!htmlString) return "";

  // Decode entity-encoded string (e.g. &lt;p&gt; or &acirc;)
  let decoded = decodeHtmlEntities(htmlString);

  // If decoded content does not contain any HTML tags, wrap paragraph blocks in <p>
  if (!/<[a-z][\s\S]*>/i.test(decoded)) {
    const paragraphs = decoded.split(/\n+/).filter((p) => p.trim());
    if (paragraphs.length > 0) {
      return paragraphs.map((p) => `<p>${p.trim()}</p>`).join("");
    }
  }

  return decoded;
}
