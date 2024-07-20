import Http from "./Http";
import { DEFAULT_LIMIT_AND_OFFSET } from "./BiomarkersService";

class UsersService extends Http {
  static $displayName = "UsersService";

  async getUsers(params) {
    return await this.get('/admins/users', { params })
  }

  async getUserById(id) {
    return await this.get(`/admins/users/${id}`)
  }

  async getUserLabsResults(id, params = DEFAULT_LIMIT_AND_OFFSET) {
    return await this.get(`/admins/users/lab-results/${id}`, { params })
  }

  async getUserTags(id, params = DEFAULT_LIMIT_AND_OFFSET) {
    return await this.get(`/admins/users/user-tags/${id}`, { params })
  }

  async getLabsDates(id) {
    return await this.get(`/admins/users/lab-results/dates/${id}`)
  }

  async getUsersResults(id, params = DEFAULT_LIMIT_AND_OFFSET) {
    return await this.get(`/admins/users/${id}/results`, { params })
  }

  async createUserResults(id, data) {
    return await this.post(`/admins/users/${id}/results`, data, { customToast: true });
  }

  async getOtherLabPDFResultsList(userId, params = DEFAULT_LIMIT_AND_OFFSET) {
    return await this.get(`/admins/users/other-lab-pdf-results/${userId}`, {
      params: {
        ...params
      }
    })
  }

  async updateOtherLabPDFResult(id, data) {
    return await this.patch(`/admins/users/other-lab-pdf-results/file/${id}`, data)
  }

  async getLabsList(params) {
    return await this.get(`/hl7/labs`, { params });
  }
}

export default UsersService;
