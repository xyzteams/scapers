import axios from 'axios';
import { Readable } from 'stream';

interface AnimagineOptions {
    prompt?: string;
    negative?: string;
    style?: "none" | "Cinematic" | "Photographic" | "Anime" | "Manga" | "Digital Art" | "Pixel art" | "Fantasy art" | "Neonpunk" | "3D Model";
    sampler?: "DDIM" | "Euler a" | "Euler" | "DPM++ 2M Karras" | "DPM++ 2M SDE Karras" | "DPM++ SDE Karras";
    quality?: "none" | "Light" | "Standard" | "Heavy";
    width?: number;
    height?: number;
    ratio?: "Custom" | "640 x 1536" | "832 x 1216" | "1024 x 1024" | "1152 x 896" | "1344 x 768" | "768 x 1344" | "896 x 1152" | "1216 x 832" | "1536 x 640";
}

export default function animagine(options: AnimagineOptions = {}): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                prompt = "Cute Cat",
                negative = "Not Real",
                style = "Anime",
                sampler = "Euler a",
                ratio = "896 x 1152",
                quality = "Standard",
                width = 1024,
                height = 1024,
            } = options;
            const BASE_URL = "https://linaqruf-animagine-xl.hf.space";
            const session_hash = Math.random().toString(36).substring(2);

            if (!/\(None\)|Cinematic|Photographic|Anime|Manga|Digital Art|Pixel art|Fantasy art|Neonpunk|3D Model/.test(style)) style = "Anime";
            if (!/DDIM|Euler a|Euler|DPM\+\+ 2M Karras|DPM\+\+ 2M SDE Karras|DPM\+\+ SDE Karras/.test(sampler)) sampler = "Euler a";
            if (!/\(none\)|Light|Standard|Heavy/.test(quality)) quality = "Heavy";
            if (!/Custom|640 x 1536|832 x 1216|1024 x 1024|1152 x 896|1344 x 768|768 x 1344|896 x 1152|1216 x 832|1536 x 640/.test(ratio)) ratio = "896 x 1152";
            if (ratio === "Custom") {
                if (!width || isNaN(width) || width > 2048) return reject("Enter Valid Image Width Below 2048");
                if (!height || isNaN(height) || height > 2048) return reject("Enter Valid Image Height Below 2048");
            }

            const headers = {
                origin: BASE_URL,
                referer: BASE_URL + "/?",
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                'Content-Type': 'application/json',
            };

            const tokenResponse = await axios.post(BASE_URL + "/run/predict", {
                data: [0, true],
                event_data: null,
                fn_index: 4,
                session_hash,
                trigger_id: 6,
            }, { headers });
            const token = tokenResponse.data.data[0];

            await axios.post(BASE_URL + "/queue/join?", {
                data: [
                    prompt,
                    negative,
                    token,
                    width,
                    height,
                    7,
                    28,
                    sampler,
                    ratio,
                    style,
                    quality,
                    false,
                    0.55,
                    1.5,
                    true,
                ],
                event_data: null,
                fn_index: 5,
                session_hash,
                trigger_id: 7,
            }, { headers });

            const streamResponse = await axios.get<Readable>(BASE_URL + "/queue/data?" + new URLSearchParams({ session_hash }), {
                responseType: 'stream',
                headers,
            });

            streamResponse.data.on("data", (v: Buffer) => {
                const data = JSON.parse(v.toString().split("data: ")[1] ?? "{}");
                if (data.msg !== "process_completed") return;
                if (!data.success) return reject("Image Generation Failed!");
                return resolve(data.output.data[0]);
            });

        } catch (e) {
            reject(e);
        }
    });
}
