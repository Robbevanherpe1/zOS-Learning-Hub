import DOMPurify from "dompurify";
import { marked } from "marked";

function stripLegacyHtmlPresentation(html) {
  if (typeof window === "undefined" || !window.DOMParser) return html;

  const doc = new window.DOMParser().parseFromString(html, "text/html");
  const root = doc.body;

  const removeDangerous = root.querySelectorAll("script, style, link, meta, object, embed");
  removeDangerous.forEach((el) => el.remove());

  const all = root.querySelectorAll("*");
  all.forEach((el) => {
    // Fix legacy relative media paths so they work in Vite `public/`
    if (el.tagName === "IMG") {
      const src = el.getAttribute("src") || "";
      const fixed = src
        .replace(/^\.?\/*images\//, "/images/")
        .replace(/^\.?\/*public\/images\//, "/images/");
      if (fixed !== src) el.setAttribute("src", fixed);
    }

    // Kill inline presentation from old Tailwind-in-JSON approach
    el.removeAttribute("class");
    el.removeAttribute("style");

    // Remove inline JS handlers just in case
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.toLowerCase().startsWith("on")) {
        el.removeAttribute(attr.name);
      }
    }
  });

  return root.innerHTML;
}

function sanitizeHtmlAllowingYoutubeEmbeds(html) {
  // Allow iframes, but only keep safe YouTube embed sources.
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName && data.tagName.toLowerCase() === "iframe") {
      const src = node.getAttribute("src") || "";
      const ok =
        src.startsWith("https://www.youtube-nocookie.com/embed/") ||
        src.startsWith("https://www.youtube.com/embed/");
      if (!ok) node.remove();
    }
  });

  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "height",
      "loading",
      "referrerpolicy",
      "src",
      "title",
      "width"
    ]
  });
}

export function toSafeHtmlFromTheory(theory) {
  const markdown = theory?.markdown;
  if (typeof markdown === "string" && markdown.trim().length > 0) {
    const rendered = marked.parse(markdown, { breaks: true, gfm: true });
    return sanitizeHtmlAllowingYoutubeEmbeds(rendered);
  }

  const legacyHtml = theory?.content;
  if (typeof legacyHtml === "string" && legacyHtml.trim().length > 0) {
    const normalized = stripLegacyHtmlPresentation(legacyHtml);
    return sanitizeHtmlAllowingYoutubeEmbeds(normalized);
  }

  return "";
}

