import DOMPurify from "dompurify";
import { marked } from "marked";

function wrapRenderedMarkdownIntoSections(html) {
  if (typeof window === "undefined" || !window.DOMParser) return html;

  const doc = new window.DOMParser().parseFromString(html, "text/html");
  const root = doc.body;

  const nodes = Array.from(root.childNodes);
  root.innerHTML = "";

  const isHeading = (n) =>
    n?.nodeType === 1 &&
    ["H2", "H3", "H4"].includes(n.tagName);

  let currentSection = null;

  for (const n of nodes) {
    if (isHeading(n)) {
      currentSection = doc.createElement("section");
      root.appendChild(currentSection);
      currentSection.appendChild(n);
      continue;
    }

    if (!currentSection) {
      currentSection = doc.createElement("section");
      root.appendChild(currentSection);
    }

    currentSection.appendChild(n);
  }

  return root.innerHTML;
}

function stripLegacyHtmlPresentation(html) {
  if (typeof window === "undefined" || !window.DOMParser) return html;

  const doc = new window.DOMParser().parseFromString(html, "text/html");
  const root = doc.body;

  const removeDangerous = root.querySelectorAll("script, style, link, meta, object, embed");
  removeDangerous.forEach((el) => el.remove());

  const all = root.querySelectorAll("*");
  all.forEach((el) => {
    if (el.tagName === "IMG") {
      const src = el.getAttribute("src") || "";
      const fixed = src
        .replace(/^\.?\/*images\//, "/images/")
        .replace(/^\.?\/*public\/images\//, "/images/");
      if (fixed !== src) el.setAttribute("src", fixed);
    }

    el.removeAttribute("class");
    el.removeAttribute("style");

    for (const attr of Array.from(el.attributes)) {
      if (attr.name.toLowerCase().startsWith("on")) {
        el.removeAttribute(attr.name);
      }
    }
  });

  return root.innerHTML;
}

function sanitizeHtmlAllowingYoutubeEmbeds(html) {
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
    ADD_TAGS: ["iframe", "section"],
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
  const legacyHtml = theory?.content;
  const md = typeof markdown === "string" ? markdown.trim() : "";
  const html = typeof legacyHtml === "string" ? legacyHtml.trim() : "";

  const shouldPreferLegacy =
    html.length > 0 &&
    (md.length === 0 || (html.length >= 1500 && html.length > md.length * 1.35));

  if (!shouldPreferLegacy && md.length > 0) {
    const rendered = marked.parse(md, { breaks: true, gfm: true });
    const boxed = wrapRenderedMarkdownIntoSections(rendered);
    return sanitizeHtmlAllowingYoutubeEmbeds(boxed);
  }

  if (html.length > 0) {
    const normalized = stripLegacyHtmlPresentation(html);
    return sanitizeHtmlAllowingYoutubeEmbeds(normalized);
  }

  return "";
}

