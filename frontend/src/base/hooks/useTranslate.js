import { useCallback, useContext } from "react";
import {MDTextContext} from "../contexts/TranslateContainer";

export const useTranslate = () => {
  const { Translate, language, selectLanguage } = useContext(MDTextContext);
  const translate = useCallback((key, params) => Translate.translate(key, params), [Translate]);
  return [ translate, language, selectLanguage ]
};