import React, { useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import SimpleBar from "simplebar-react";
import { useTranslate } from '../../hooks/useTranslate';
import Icon from "../Icon";
import joinClassNames from "../../helpers/joinClassNames";
import { useTemplates, useUpdateTemplates } from "../../context/templates";

const ACTIVE_LINK = 'waves-effect active mm-active';
const ARROW = 'has-arrow';
const CONDENSED = 'condensed';

export default function generateSidebarLinks(linksArray, sidebarType) {

  const location = useLocation();
  const currentLocation = useMemo(() => location.pathname, [location]);
  const navigate = useNavigate();

  const isCondensed = sidebarType === CONDENSED;

  const [translate] = useTranslate();

  const [activeLink, setActiveLink] = useState(currentLocation);

  const { shouldUpdate } = useTemplates();
  const updateTemplatesOnSidebar = useUpdateTemplates()

  function getLinkClassName(link, arrow = '') {
    if(currentLocation.includes(link)) {
      return `${ACTIVE_LINK} ${arrow}`;
    }
    return `waves-effect ${arrow}`;
  }

  function isOpenedCollapse(link) {
    if(link?.length > activeLink?.length) {
      return;
    }
    return activeLink?.startsWith(link)
  }

  const toggleCollapse = (link, parentLink) => {
    setActiveLink(prevState => {
      return prevState === link ? parentLink : link;
    });
  }

  function getLinksFloor(children, parentLink) {
    return children.map(child => {

      const hasChilds = !!child.children?.length;

      return (<li key={child.linkTo}>
        <a
          className={joinClassNames(hasChilds ? getLinkClassName(child.linkTo, ARROW) : getLinkClassName(child.linkTo), "d-flex align-items-center w-100")}
          onClick={(event) => {
            if(hasChilds) {
              toggleCollapse(child.linkTo, parentLink)
            } else {
              setActiveLink(child.linkTo)
              navigate(child.linkTo)
            }
            event.stopPropagation()
          }}
        >
          {child.icon &&
            <Icon
              icon={child.icon}
              className={joinClassNames("link-icon", activeLink?.includes(child.linkTo) && "active")}
            />}
          <span>{translate(child.label)}</span>
        </a>
        {(hasChilds && (!isCondensed ? <Collapse isOpen={isOpenedCollapse(child.linkTo)}>
          <ul className="sub-menu">
            {getLinksFloor(child.children, child.linkTo)}
          </ul>
        </Collapse> : <ul className="sub-menu">
          {getLinksFloor(child.children, child.linkTo)}
        </ul>))}
      </li>)
    })
  }

  useEffect(() => {
    if(!shouldUpdate) return;
    updateTemplatesOnSidebar({ shouldUpdate: false })
  }, [shouldUpdate]);


  const linksTop = linksArray.filter(({bottomLink}) => !bottomLink)
  const linksBottom = linksArray.filter(({bottomLink}) => bottomLink)

  return (
    <SimpleBar style={{height: "calc(100vh - 70px)"}}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled custom-sidebar-menu">
          {getLinksFloor(linksTop)}

          {getLinksFloor(linksBottom)}
        </ul>
      </div>
      <div id="sidebar-footer">
        <div className="powered-by-label">
          Powered by
        </div>
        <div className="powered-by-logo">
          <span className="logo-lg">
            <Icon icon="sidebarLogo"/>
          </span>
        </div>
      </div>
    </SimpleBar>
  )
}

generateSidebarLinks.propTypes = {
  linksArray: PropTypes.array,
}
