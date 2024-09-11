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

const Header = () => {
  const [isOpen, updateIsOpen] = useState(false)
  /**
   * @type {StorageService}
   */
  const storage = useService(StorageService);

  const { firstName = "", lastName = "" } = storage.get(KEY_USER, { firstName: "", lastName: "" });

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div>
              <Link to="/" className="logo logo-light">
                <span className="logo-lg">
                  <img alt="logo" style={{maxHeight: '50px'}}/>
                </span>
              </Link>
            </div>
          </div>
          <section>
            <Dropdown
              isOpen={isOpen}
              toggle={() => updateIsOpen(prevState => !prevState)}
              className="d-inline-block"
            >
              <DropdownToggle
                className="btn header-item no-outline no-border ps-0"
                id="page-header-user-dropdown"
                tag="button"
              >
                <section className="pointer-events-none">
                  <span className="ms-2 me-1">{firstName} {lastName}</span>
                  <i className={joinClassNames("mdi mdi-chevron-down", isOpen && "mdi-rotate-180")}/>
                </section>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <div className="dropdown-divider"/>
                <Link to="/auth/logout" className="dropdown-item px-3 d-flex align-content-center">
                  <i className="bx bx-log-out font-size-16 align-middle me-2 text-danger"/>
                  Logout
                </Link>
              </DropdownMenu>
            </Dropdown>
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
