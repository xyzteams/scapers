import axios from "axios";

interface CobaltResponse {
    [key: string]: any;
}

function ytmp4(url: string): Promise<CobaltResponse> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post("https://api.cobalt.tools/api/json", {
                url: url,
                filenamePattern: "nerdy",
                vQuality: "480"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            resolve(response.data);
        } catch (err) {
            reject(err);
        }
    });
}

function ytmp3(url: string): Promise<CobaltResponse> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post("https://api.cobalt.tools/api/json", {
                url: url,
                isAudioOnly: true,
                filenamePattern: "nerdy",
                vQuality: "480"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            resolve(response.data);
        } catch (err) {
            reject(err);
        }
    });
}

export { ytmp4, ytmp3 };
