import Http from "./Http";

class UserSegmentsService extends Http {
    static $displayName = "UserSegmentsService";

    async getSegments(params) {
        return await this.get(`/segments`, { params });
    }

    async getSegmentById(id) {
        return await this.get(`/segments/${id}`);
    }

    createSegments(values) {
        return this.post(`/segments`, values);
    }

    deleteSegments(id) {
        return this.delete(`/segments/${id}`);
    }

    updateSegments(id, values) {
        return this.put(`/segments/${id}`, values);
    }

    copySegment(id) {
        return this.post(`/segments/${id}`)
    }

    getAttributes(params) {
        return this.get(`/attributes`, { params });
    }

    updateAttribute(id, values) {
        return this.put(`/attributes/${id}`, values);
    }

    getAttributeById(id) {
        return this.get(`/attributes/${id}`);
    }

    createAttributes(values) {
        return this.post(`/attributes`, values);
    }

    deleteAttribute(id) {
        return this.delete(`/attributes/${id}`);
    }

    getAttributesCategories(params) {
        return this.get(`/attributes/categories`, { params });
    }
}

export default UserSegmentsService;
