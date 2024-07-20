import { useCallback } from "react";
import * as sanitizeHtml from 'sanitize-html';

export const NO_ESCAPE = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

const allowedAttributes = {
  'span': ['class'],
};

export const generateOutput = (html) => {
  return { dangerouslySetInnerHTML: { __html: sanitizeHtml(html, { allowedAttributes }) } }
};

const escapeRegExpFn = (string) => `${string}`.replace(NO_ESCAPE, '\\$&')
const escapeRegExpFnMultiple = (string) => `${string?.split(" ")?.join('|')}`?.replace(NO_ESCAPE, '$&')

export const useHighlight = (highlighted, exact = false, isMultipleHighlight = false) => {

  const decorateText = useCallback((text) => {

    if (!text || !highlighted) return generateOutput(text || "");

    const pattern = isMultipleHighlight ? new RegExp(escapeRegExpFnMultiple(highlighted), 'gi') : new RegExp(escapeRegExpFn(highlighted), 'gi')

    if (exact && highlighted !== text) return generateOutput(text);

    const html = text.toString().replaceAll(pattern, (selectedText) => {
      return `<span class="highlighted-text">${selectedText}</span>`
    });

    return generateOutput(html)

  }, [highlighted, exact]);

  return {
    decorateText
  }
};
