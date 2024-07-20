import React from "react";
import { MDText } from "i18n-react";
import {KEY_LANGUAGE} from "../../constants/storage";
import {initService} from "../../hooks/useService";
import StorageService from "../../../services/StorageService";
import PropTypes from 'prop-types'

export const MDTextContext = React.createContext({});

class TranslateContainer extends React.Component {

  static defaultProps = {
    initialLanguage: undefined,
    language: null
  };

  constructor(props) {
    super(props);

    this.state = {
      language: props.language,
      Translate: new MDText({}),
      selectLanguage: this.selectLanguage
    };
  }

  componentDidMount() {
    const { initialLanguage, language } = this.props;
    const storageService = initService(StorageService);
    const lg = language || storageService.get(KEY_LANGUAGE, initialLanguage);
    this.selectLanguage(lg);
  }

  selectLanguage = (key) => {
    const { Translate } = this.state;
    const { languages } = this.props;
    const storageService = initService(StorageService);

    Translate.setTexts(languages[ key ]);
    storageService.set(KEY_LANGUAGE, key);

    this.setState({
      language: key,
      Translate
    });
  };

  render() {
    const { children } = this.props;

    return (
      <MDTextContext.Provider value={this.state}>
        {children}
      </MDTextContext.Provider>
    );
  }
}

TranslateContainer.propTypes = {
  language: PropTypes.string,
  initialLanguage: PropTypes.string,
  languages: PropTypes.object,
  children: PropTypes.any,
};



export default TranslateContainer;
