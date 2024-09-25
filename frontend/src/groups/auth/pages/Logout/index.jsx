import PropTypes from 'prop-types'
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useService } from "../../../../base/hooks/useService";
import StorageService from "../../../../services/StorageService";
import { AUTH_GROUP_LINKS } from "../../config";
import AuthService from "../../../../services/AuthService";

const Logout = () => {
  const navigate = useNavigate();
  /**
   * @type {StorageService}
   */
  const storage = useService(StorageService);
  /**
   * @type {AuthService}
   */
  const authService = useService(AuthService);

  useEffect(() => {
    navigate(AUTH_GROUP_LINKS.LINK_LOGIN, { replace: true })
    storage.clear();
  }, [storage, navigate, authService]);

  return null
};

Logout.propTypes = {
  logoutUser: PropTypes.func
};

export default Logout
