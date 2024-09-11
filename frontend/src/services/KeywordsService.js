import Http from "./Http";

class KeywordsService extends Http {
    static $displayName = "KeywordsService";

    async getKeywords(params) {
        return await this.get(`/keywords`, { params });
    }

    async getKeywordById(id) {
        return await this.get(`/keywords/${id}`);
    }

    createKeyword(values) {
        return this.post(`/keywords`, values);
    }

    deleteKeywords(id) {
        return this.delete(`/keywords/${id}`);
    }
}

export default KeywordsService;
