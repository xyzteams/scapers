import axios from 'axios';

interface QuoteRequest {
    type: string;
    format: string;
    backgroundColor: string;
    width: number;
    height: number;
    scale: number;
    messages: Array<{
        entities: any[];
        avatar: boolean;
        from: {
            id: number;
            name: string;
            photo: {
                url: string;
            };
        };
        text: string;
        replyMessage: Record<string, unknown>;
    }>;
}

export default async function quote(text: string, ppurl: string, nickname: string): Promise<any> {
    const json: QuoteRequest = {
        type: 'quote',
        format: 'png',
        backgroundColor: '#FFFFFF',
        width: 512,
        height: 768,
        scale: 2,
        messages: [
            {
                entities: [],
                avatar: true,
                from: {
                    id: 1,
                    name: nickname,
                    photo: {
                        url: ppurl
                    }
                },
                text: text,
                replyMessage: {}
            }
        ]
    };

    try {
        const response = await axios.post('https://bot.lyo.su/quote/generate', json, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to generate quote:", error);
        throw new Error("Failed to generate quote. Please try again later.");
    }
}
