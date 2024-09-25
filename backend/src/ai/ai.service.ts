import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from "@google/generative-ai"
@Injectable()
export class AIService {
    private readonly API_KEY = process.env.AI_API_KEY;

    private readonly genAI = new GoogleGenerativeAI(process.env.API_KEY);
    private readonly model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    async analyzeContext(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);

            return result.response.text();
        } catch (error) {
            console.error('AI API request failed:', error);
            return '';
        }
    }

    static generateGetContextByKeywordsPrompt(keyword: string, htmlContent: string): string {
        return `Analyze the context in which the word "${keyword}" is used in the following HTML content. Provide details in Russian if the keyword is found in headers, footers, meta tags, user comments, or in the body text:
        \n\n HTML Content: ${htmlContent}. Ответ предоставьте на русском языке.`;
    }
}

