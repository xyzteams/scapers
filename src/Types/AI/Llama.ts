import Groq from "groq-sdk";

export interface ChatMessage {
    role: string;
    content: string;
}

export interface VoiceCompletionOptions {
    stream: any;
    prompt: string;
    temperature?: number;
    language?: string;
    response_format?: string;
}

export default class LlamaAI {
    private apiKey: string;
    private groq: any;
    private model: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("API Key is required");
        }
        this.apiKey = apiKey;
        this.groq = new Groq({ apiKey: this.apiKey });
        this.model = "llama-3.1-8b-instant";
    }

    async getChatCompletion(messages: ChatMessage[]): Promise<any> {
        return this.groq.chat.completions.create({
            messages,
            model: this.model,
        });
    }

    async getVoiceCompletion(options: VoiceCompletionOptions): Promise<any> {
        const { stream, prompt, temperature = 0.5, language = "ID", response_format = "json" } = options;
        return this.groq.audio.transcriptions.create({
            file: stream,
            model: this.model,
            prompt,
            temperature,
            language,
            response_format,
        });
    }

    async getModels(): Promise<any> {
        const res = await this.groq.models.list();
        return res.data;
    }

    setModel(model: string): void {
        this.model = model;
    }

    setApiKey(apiKey: string): void {
        if (!apiKey) {
            throw new Error("API Key is required");
        }
        this.apiKey = apiKey;
        this.groq = new Groq({ apiKey: this.apiKey });
    }
}