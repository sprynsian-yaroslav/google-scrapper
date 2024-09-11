import Http from "./Http";

class ScrapingResultService extends Http {
    static $displayName = "ScrapingResultService";

    async getResults(keywordId, params) {
        try {
            return await this.get(`/scraping/results/${keywordId}`, {
                params,
            });
        } catch (error) {
            console.error("Error fetching scraping results:", error);
            throw error;
        }
    }

    async startScraping(keywordId) {
        try {
            const response = await this.post(`/scraping/${keywordId}`);
            return response.data;
        } catch (error) {
            console.error("Error starting scraping process:", error);
            throw error;
        }
    }
}

export default ScrapingResultService;

