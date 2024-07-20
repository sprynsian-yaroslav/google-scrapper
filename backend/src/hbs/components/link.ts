import Handlebars from "handlebars";

export function link(text: string, url: string) {
  const safeUrl = Handlebars.escapeExpression(url),
    safeText = Handlebars.escapeExpression(text);
  return new Handlebars.SafeString("<a href='" + safeUrl + "'>" + safeText + "</a>");
};