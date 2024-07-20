import StorageService from "./StorageService";
import { KEY_LOCATION_SESSION, STORAGE } from "../base/constants/storage";


class SessionStorage extends StorageService {
  _getSessionKey() {
    const place = this.get(KEY_LOCATION_SESSION, STORAGE.LOCAL);
    return `${place}::session`
  }

  getSession() {
    return this.get(this._getSessionKey(), {})
  }

  setSession(data) {
    this.set(this._getSessionKey(), data)
  }

  static $displayName = "SessionStorage"
}

export default SessionStorage
