import en from "../../../i18n/en";
import { MDText } from "i18n-react";
import {KEY_LANGUAGE} from "../../constants/storage";
import {initService} from "../../hooks/useService";
import StorageService from "../../../services/StorageService";
import {LANGUAGES} from "../../constants/languages";

export const languages = {
  [LANGUAGES.EN]: en,
};

const getLanguage = () => {
  const storageService = initService(StorageService);
  return storageService.get(KEY_LANGUAGE, LANGUAGES.EN)
};

export class Translate {
  constructor(language = getLanguage()) {
    this.md = new MDText({});
    this.md.setTexts(languages[language]);
  }

  translate(key, context) {
    return this.md.translate(key, context);
  }
}
