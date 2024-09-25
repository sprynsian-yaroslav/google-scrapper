import PropTypes from 'prop-types'
import React, { useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../../store/actions"

import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import joinClassNames from "../../helpers/joinClassNames";
import { KEY_USER } from "../../constants/storage";
import { useService } from "../../hooks/useService";
import StorageService from "../../../services/StorageService";
import logo from '../../assets/logo.svg';

const Header = () => {

  const handleUpdate = () => {
    window.location.reload();
  };

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div>
              <Link to="/" className="logo logo-light">
                <span className="logo-lg">
                  <img alt="logo" src={logo} style={{maxHeight: '80px'}}/>
                </span>
              </Link>
            </div>
          </div>
          <section className="d-flex align-items-center gap-3">
            <div onClick={handleUpdate}>
              <i className="bx bx-sync font-size-24 align-middle me-2 text-primary"/>
            </div>
            <Link to="/auth/logout" className="dropdown-item px-3 d-flex align-content-center">
              <i className="bx bx-log-out font-size-24 align-middle me-2 text-danger"/>
            </Link>
          </section>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
}

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(Header)
