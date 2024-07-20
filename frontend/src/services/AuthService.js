import Http from "./Http";

class AuthService extends Http {
  static $displayName = "AuthService";

  async login({ email, password }) {
    return await this.post("/admins/sessions", { email, password }, { customToast: true })
  }

  async logout() {
    return await this.delete("/admins/sessions");
  }

  async sendRestorePasswordEmail({ email }) {
    return await this.post("/admins/verifications/password", { email }, { customToast: true });
  }

  async resetPassword(values) {
    return await this.patch("/admins/verifications/password", values);
  }

  async checkLinkRelevance(token) {
    return await this.get("/admins/verifications/password", { params: token, customToast: true  });
  }

  async confirmMfaVerification(data){
    return await this.patch("/users/additional-authentications", data, { customToast: true })
  }

  async resendMfaCode(data){
    return await this.put("/users/additional-authentications", data)
  }
}

export default AuthService;
