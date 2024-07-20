import React from "react";
import PropTypes from "prop-types";
import joinClassNames from "../helpers/joinClassNames";
import { ReactComponent as logo } from "../assets/logo.svg";
import { ReactComponent as eye } from "../../assets/images/eye.svg";
import { ReactComponent as message } from "../../assets/images/message.svg";
import { ReactComponent as biomarkers } from "../../assets/images/biomarker.svg";
import { ReactComponent as foodIntolerance } from "../../assets/images/bx-food-intolerance.svg";
import { ReactComponent as recommendations } from "../../assets/images/recommendations.svg";
import { ReactComponent as uploadResults } from "../../assets/images/upload.svg";
import { ReactComponent as dashboard } from "../../assets/images/dashboard.svg";
import { ReactComponent as sidebarLogo } from "../../assets/images/sidebar-logo.svg";
import { ReactComponent as logoPicture } from "../../assets/images/logoPicture.svg";
import { ReactComponent as trashIcon } from "../../assets/images/trash.svg";
import { ReactComponent as close } from "../../assets/images/close.svg";
import { ReactComponent as moreOrEqual } from "../../assets/images/moreOrEqual.svg";
import { ReactComponent as lessOrEqual } from "../../assets/images/lessOrEqual.svg";
import { ReactComponent as edit } from "../../assets/images/edit.svg";
import { ReactComponent as editPlus } from "../../assets/images/bx-pencil.svg";
import { ReactComponent as arrowDown } from "../../assets/images/arrowDown.svg";
import { ReactComponent as dndIcon } from "../../assets/images/dndIcon.svg";
import { ReactComponent as sortAsc } from "../../assets/images/sortAsc.svg";
import { ReactComponent as sortDesc } from "../../assets/images/sortDesc.svg";
import { ReactComponent as user } from "../../assets/images/user.svg";
import { ReactComponent as datepicker } from "../../assets/images/datepicker.svg";
import { ReactComponent as copy } from "../../assets/images/copy.svg";
import { ReactComponent as archive } from "../../assets/images/bx-archive-in.svg";
import { ReactComponent as unArchive } from "../../assets/images/bx-archive-out.svg";
import { ReactComponent as cartButton } from "../../assets/images/btn.svg";
import { ReactComponent as activate } from "../../assets/images/bx-power-off.svg";
import { ReactComponent as deactivate } from "../../assets/images/bx-check-circle.svg";
import { ReactComponent as customerResults } from "../../assets/images/bx-calendar-check.svg";
import { ReactComponent as threeDots } from "../../assets/images/three-dots.svg";
import { ReactComponent as uploadCloud } from "../../assets/images/bx-cloud-upload.svg";
import { ReactComponent as fileIcon } from "../../assets/images/file-icon.svg";
import { ReactComponent as check } from "../../assets/images/bx-check.svg";
import { ReactComponent as foodAndRecipes } from "../../assets/images/food-and-receipts.svg";
import { ReactComponent as program } from "../../assets/images/program.svg";
import { ReactComponent as content } from "../../assets/images/content.svg";
import { ReactComponent as arrowLeft } from "../../assets/images/arrow-left.svg";


import { ReactComponent as viewHL7 } from "../../assets/images/viewHL7.svg";
import { ReactComponent as markVerified } from "../../assets/images/markVerified.svg";
import { ReactComponent as markCancelled } from "../../assets/images/markCancelled.svg";
import { ReactComponent as reprocessHL7 } from "../../assets/images/reprocessHL7.svg";
import { ReactComponent as download } from "../../assets/images/bx-download.svg";
import { ReactComponent as viewResults } from "../../assets/images/bx-show-alt.svg";
import { ReactComponent as isCriticalResult } from "../../assets/images/isCriticalResult.svg";
import { ReactComponent as infoCircle } from "../../assets/images/bxs-info-circle.svg";

import { ReactComponent as notifications } from '../assets/bx-bell.svg';
import { ReactComponent as errorNotification } from '../assets/error-notification.svg';
import { ReactComponent as fileNotification } from '../assets/file-notification.svg';
import { ReactComponent as clocks } from '../assets/bx-time-five.svg';

import { ReactComponent as favourite } from '../../assets/images/bx-heart-filled.svg';
import { ReactComponent as notFavourite } from '../../assets/images/bx-heart.svg';
import { ReactComponent as smallTrash } from '../../assets/images/bx-trash-alt-small.svg';

import { ReactComponent as biomarkerGreenStatus } from '../../assets/images/biomarker-green-status.svg';
import { ReactComponent as biomarkerYellowWarning } from '../../assets/images/biomarker-yellow-warning.svg';
import { ReactComponent as biomarkerRedAlert } from '../../assets/images/biomarker-red-alert.svg';

import { ReactComponent as flask } from '../../assets/images/flask.svg';
import { ReactComponent as search } from '../../assets/images/search.svg';

import { ReactComponent as list } from '../../assets/images/bx-list.svg';
import { ReactComponent as userAttributes } from '../../assets/images/bx-user-attributes.svg';

import {ReactComponent as increaseIcon} from "../../assets/images/rule-action-icons/increase.svg";
import {ReactComponent as avoidIcon} from "../../assets/images/rule-action-icons/avoid.svg";
import {ReactComponent as decreaseIcon} from "../../assets/images/rule-action-icons/decrease.svg";
import {ReactComponent as userSegmentsIcon} from "../../assets/images/user-segments-icon.svg";

import {ReactComponent as downloadPDF} from "../../assets/images/br-download.svg";
import {ReactComponent as downloadRoboGP} from "../../assets/images/br-robogp-download.svg";

import {ReactComponent as endsWith} from "../../assets/images/operators/end-with.svg";
import {ReactComponent as startsWith} from "../../assets/images/operators/start-with.svg";
import {ReactComponent as notEqual} from "../../assets/images/operators/not-equal.svg";
import {ReactComponent as greater} from "../../assets/images/operators/greater.svg";
import {ReactComponent as less} from "../../assets/images/operators/less.svg";
import {ReactComponent as contains} from "../../assets/images/operators/contains.svg";
import {ReactComponent as between} from "../../assets/images/operators/between.svg";
import {ReactComponent as equal} from "../../assets/images/operators/equal.svg";
import {ReactComponent as minBetween} from "../../assets/images/operators/min-between.svg";
import {ReactComponent as maxBetween} from "../../assets/images/operators/max-between.svg";
import {ReactComponent as fitness} from "../../assets/images/fitness.svg";


const iconsMap = {
  fitness,

  endsWith,
  startsWith,
  notEqual,
  greater,
  less,
  contains,
  equal,
  between,
  favourite,
  minBetween,
  maxBetween,

  notFavourite,
  smallTrash,
  logo,
  sortAsc,
  sortDesc,
  eye,
  message,
  biomarkers,
  foodIntolerance,
  recommendations,
  uploadResults,
  dashboard,
  sidebarLogo,
  logoPicture,
  trashIcon,
  close,
  moreOrEqual,
  lessOrEqual,
  edit,
  editPlus,
  arrowDown,
  dndIcon,
  user,
  datepicker,
  copy,
  archive,
  unArchive,
  cartButton,
  activate,
  deactivate,
  customerResults,
  threeDots,
  viewHL7,
  markVerified,
  markCancelled,
  reprocessHL7,
  download,
  viewResults,
  isCriticalResult,
  infoCircle,
  notifications,
  errorNotification,
  fileNotification,
  clocks,
  uploadCloud,
  fileIcon,
  check,
  biomarkerGreenStatus,
  biomarkerYellowWarning,
  biomarkerRedAlert,
  foodAndRecipes,
  program,
  content,
  flask,
  search,
  list,
  userAttributes,
  arrowLeft,
  avoidIcon,
  increaseIcon,
  decreaseIcon,
  userSegmentsIcon,
  downloadPDF,
  downloadRoboGP,
};

const Icon = ({ className, icon, onClick, ...props }) => {
  let Svg = iconsMap[icon];
  const classes = joinClassNames("icon", className);

  return <Svg onClick={onClick} className={classes} {...props} />;
};

Icon.defaultProps = {
  className: "",
  icon: logo,
};

Icon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

export default Icon;
