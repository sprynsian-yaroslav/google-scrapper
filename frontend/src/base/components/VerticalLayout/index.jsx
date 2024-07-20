import PropTypes from 'prop-types'
import React, { Component } from "react"
import { connect } from "react-redux"
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../../store/actions"

// Layout Related Components
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import { TemplatesContext } from "../../context/templates";

class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this)
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2)
  }

  componentDidMount() {
    if(this.props.isPreloader === true) {
      document.getElementById("preloader").style.display = "block"
      document.getElementById("status").style.display = "block"

      setTimeout(function() {
        document.getElementById("preloader").style.display = "none"
        document.getElementById("status").style.display = "none"
      }, 2500)
    } else {
      document.getElementById("preloader").style.display = "none"
      document.getElementById("status").style.display = "none"
    }

    // Scroll Top to 0
    window.scrollTo(0, 0)

    if(this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme)
    }

    if(this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth)
    }

    if(this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType)
    }
    if(this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme)
    }
  }

  toggleMenuCallback = () => {
    if(this.props.leftSideBarType === "default") {
      this.props.changeSidebarType("condensed", this.state.isMobile)
    } else if(this.props.leftSideBarType === "condensed") {
      this.props.changeSidebarType("default", this.state.isMobile)
    }
  };

  render() {
    return (
      <>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot"/>
              <div className="chase-dot"/>
              <div className="chase-dot"/>
              <div className="chase-dot"/>
              <div className="chase-dot"/>
              <div className="chase-dot"/>
            </div>
          </div>
        </div>

        <TemplatesContext.Provider>
          <div id="layout-wrapper">
            <Header toggleMenuCallback={this.toggleMenuCallback}/>
            {this.props.schema && <Sidebar
              theme={this.props.leftSideBarTheme}
              type={this.props.leftSideBarType}
              isMobile={this.state.isMobile}
              schema={this.props.schema}
            />}
            <div className="main-content">
              {this.props.children}
            </div>
            <Footer/>
          </div>
        </TemplatesContext.Provider>
      </>
    )
  }
}

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.any,
  schema: PropTypes.any,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any
};

const mapStateToProps = state => {
  return {
    ...state.Layout,
  }
}
export default connect(mapStateToProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
})(Layout)
