import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import TranslateContainer from "./base/contexts/TranslateContainer";
import { LANGUAGES } from "./base/constants/languages";

import en from "./i18n/en";
import { NotificationsContext } from "./base/context/notifications";

export const languages = {
  [LANGUAGES.EN]: en,
};

const Context = ({ children }) => (
  <Provider store={store}>
    <TranslateContainer languages={languages} initialLanguage={LANGUAGES.EN}>
      <NotificationsContext.Provider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </NotificationsContext.Provider>
    </TranslateContainer>
  </Provider>
);

Context.propTypes = {
  children: PropTypes.any,
};

export default Context;
