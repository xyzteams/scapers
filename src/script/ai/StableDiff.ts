import axios from 'axios';

export default function stableDiff(prompt: string, negative: string = ""): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!prompt) return reject("Enter Prompt!");

            const res = await axios.post(
                "https://requesteracessibili.joaovitorkas13.workers.dev",
                {
                    prompt: prompt,
                    negative_prompt: negative,
                    sync_mode: 1,
                },
                {
                    headers: {
                        authority: "requesteracessibili.joaovitorkas13.workers.dev",
                        "Content-Type": "application/json",
                        origin: "https://just4demo24.blogspot.com",
                        referer: "https://just4demo24.blogspot.com/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    },
                }
            );

            resolve(res.data);
        } catch (e) {
            reject(e);
        }
    });
}
