import PropTypes from "prop-types";
import generateSidebarLinks from "./generateSidebarLinks";

const SidebarContent = ({ type, schema = [] }) => {
  return generateSidebarLinks(schema, type)
};

SidebarContent.propTypes = {
  type: PropTypes.string,
  schema: PropTypes.any,
};

export default SidebarContent;
