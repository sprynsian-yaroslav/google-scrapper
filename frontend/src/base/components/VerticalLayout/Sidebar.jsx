import PropTypes from "prop-types"
import React from "react"
import SidebarContent from "./SidebarContent"


const Sidebar = ({ type, schema }) => {

  return (
    <div className="vertical-menu">
      <div data-simplebar className="h-100">
        <SidebarContent type={type} schema={schema}/>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
  schema: PropTypes.any,
};

export default Sidebar