import sanitizeHtml from "sanitize-html"

export const sanitizeHTML = (html: string) => {
  const cleanedHtml = html
    .replace(/&nbsp;/g, " ")      // remove non-breaking spaces
    .replace(/\s+/g, " ")         // normalize whitespace

  return sanitizeHtml(cleanedHtml, {
    allowedTags: [
      "p", "div", "br",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "b", "em", "i", "u", "s", "strike", "code", "pre",
      "ul", "ol", "li",
      "blockquote",
      "hr",
      "a",
      "img",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "span", "mark", "del", "ins", "sub", "sup"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "style"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class", "id", "dir", "style"]
    },
    transformTags: {
      blockquote: (tagName, attribs) => ({
        tagName: "blockquote",
        attribs: {
          ...attribs,
          style:
            "border-left: 4px solid #d1d5db; padding-left: 1rem; margin-left: 0; margin-right: 0; font-style: italic; color: #4b5563; margin-top: 1rem; margin-bottom: 1rem;"
        }
      }),
      ul: (tagName, attribs) => ({
        tagName: "ul",
        attribs: {
          ...attribs,
          style: "list-style-type: disc; padding-left: 2rem; margin: 1rem 0;"
        }
      }),
      ol: (tagName, attribs) => ({
        tagName: "ol",
        attribs: {
          ...attribs,
          style: "list-style-type: decimal; padding-left: 2rem; margin: 1rem 0;"
        }
      }),
      li: (tagName, attribs) => ({
        tagName: "li",
        attribs: {
          ...attribs,
          style: "margin: 0.25rem 0;"
        }
      }),
      h1: (tagName, attribs) => ({
        tagName: "h1",
        attribs: {
          ...attribs,
          style: "font-size: 32px; line-height: 1.2; margin-bottom: 1rem;"
        }
      }),
      h2: (tagName, attribs) => ({
        tagName: "h2",
        attribs: {
          ...attribs,
          style:
            "font-size: 25px; line-height: 1.3; margin-top: 2rem; margin-bottom: 0.75rem;"
        }
      }),
      h3: (tagName, attribs) => ({
        tagName: "h3",
        attribs: {
          ...attribs,
          style:
            "font-size: 18px; line-height: 1.4; margin-top: 1.5rem; margin-bottom: 0.5rem;"
        }
      }),
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          style: "color: #2563eb; text-decoration: underline;"
        }
      })
    }
  })
}
