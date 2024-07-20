import { checkOnDefined } from "../../groups/app/Biomarkers/CreateEdit/fromValidation";

export const deleteItemFromObject = (object, nameToDelete) => {
  const { [nameToDelete]: omit, ...rest } = object;
  return rest;
}

export const addTrueObjectField = (key = "") => ({ [key]: true });

export const isObjectEmpty = (object = {}) => !!Object.keys(object).length;

export const filterObjectFromNull = (object = {}) => {
  const filteredObject = {};
  Object.keys(object).forEach((key) => {
    if(checkOnDefined(object[key])){
      filteredObject[key] = object[key];
      return
    }
    filteredObject[key] = undefined;
  })
  return filteredObject;
}