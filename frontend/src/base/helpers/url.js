/**
 *
 * @param {string} text - string with keyword for replace
 * @param {Object} keywordsMap - map keywords with values
 * @return {string}
 * @desc - example ':label is Required' > 'FirstName is Required'
 */
export const replaceUrlParams = (text, keywordsMap) => {
  if (!text) return text;

  Object.keys(keywordsMap).forEach(keyword => {
    text = text.replace(`:${keyword}`, keywordsMap[keyword] + "")
  });

  return text;
}