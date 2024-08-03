import axios from "axios";

interface QuoteMessage {
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
    replyMessage: object;
}

interface QuoteRequest {
    type: string;
    format: string;
    backgroundColor: string;
    width: number;
    height: number;
    scale: number;
    messages: QuoteMessage[];
}

export default async function quote(text: string, ppurl: string, nickname: string): Promise<any> {
    const json: QuoteRequest = {
        type: "quote",
        format: "png",
        backgroundColor: "#FFFFFF",
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
    return await axios.post("https://bot.lyo.su/quote/generate", json, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.data)
        .catch(err => { throw err });
}