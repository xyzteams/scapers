import { Readable } from "stream";
import Groq from "groq-sdk";
import axios, { AxiosResponse } from "axios";
import yts, { SearchResult, VideoSearchResult } from "yt-search";
import cheerio from "cheerio";
import FormData from 'form-data';
import path from "path"

import { AIResponse, AnimagineOptions, ChatMessage, DownloadResponse, DriveData, GempaResult, IGDLResult, IgStalkResult, IGStoryResult, KhodamResult, MediafireData, NGLResponse, PindlDownload, PindlResult, Quote, QuoteAnime, QuoteRequest, QuoteResponse, samehadakuData, samehadakuDownload, ServerData, SnackVideoData, SnackVideoResult, SpotifyMetadata, SpotifyResponse, StickerData, StyledText, TeraboxResponse, ThreadsResponse, TikTokDLResult, TikTokVideo, TwitterMedia, VideoDetails, VoiceCompletionOptions } from "./interface.js";
import { fetchBuffer, sleep } from "./functions.js";
import { readFileSync, unlinkSync, writeFileSync } from "fs";


export async function ainews(question: string): Promise<AIResponse | null> {
    try {
        const response = await axios.post<AIResponse>('https://api.hai.news/question', {
            chat_id: '9ea5fef5-bbea-4e13-a3d8-3998bb58d344',
            question,
            storage_path: '/var/www/hai.news/storage/app/public/',
            temperature: 0.8,
            tokens: 10000000,
            language: 'en'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Android 12; Mobile; rv:130.0) Gecko/130.0 Firefox/130.0',
                'Referer': 'https://hai.news/news/9ea5fef5-bbea-4e13-a3d8-3998bb58d344'
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function animagine(options: AnimagineOptions = {}): Promise<string> {
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

export async function simi(text: string): Promise<string> {
    try {
        const api = 'https://api.simsimi.vn/v1/simtalk';
        const params = new URLSearchParams({
            text,
            lc: 'id',
            key: ''
        });

        const response = await axios.post(api, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return response.data.message;
    } catch (error) {
        console.error('Error occurred while communicating with Simsimi API:', error);
        return 'Unexpected error occurred. Please try again later.';
    }
}

export function stableDiff(prompt: string, negative: string = ""): Promise<any> {
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

            if (res.data.images && res.data.images.length > 0) {
                const image = res.data.images[0];
                const a = image.url.replace(/^data:image\/jpeg;base64,/, '');
                const b = Buffer.from(a, 'base64');
                resolve(b);
            } else {
                reject({ status: false });
            }
        } catch (e) {
            reject(e);
        }
    });
}

export class LlamaAI {
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

export async function drive(url: string): Promise<DriveData> {
    try {
        if (!/drive\.google\.com\/file\/d\//gi.test(url)) {
            throw new Error("Invalid URL");
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const id = url.split("/")[5];
        const data: DriveData = {
            name: $("head").find("title").text()?.split("-")[0]?.trim() ?? "",
            download: `https://drive.google.com/uc?id=${id}&export=download`,
            link: url,
        };

        return data;
    } catch (error) {
        throw error;
    }
}

export async function igdlv1(url: string): Promise<IGDLResult> {
    try {
        let result: IGDLResult = { status: true, media: [] };
        const { data } = await axios("https://www.y2mate.com/mates/analyzeV2/ajax", {
            method: "post",
            data: new URLSearchParams({
                k_query: url,
                k_page: "Instagram",
                hl: "id",
                q_auto: '0'
            }),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "PostmanRuntime/7.32.2"
            }
        });

        data.links.video.forEach((video: { url: string }) => result.media!.push(video.url));
        return result;
    } catch (err) {
        console.error(err);
        return {
            status: false,
            message: "Media not found"
        };
    }
}

export async function igdlv2(url: string): Promise<string[]> {
    try {
        const response = await axios.request({
            method: "GET",
            url: "https://instagram-post-reels-stories-downloader.p.rapidapi.com/instagram/",
            params: { url },
            headers: {
                "X-RapidAPI-Key": "6a9259358bmshba34d148ba324e8p12ca27jsne16ce200ce10",
                "X-RapidAPI-Host": "instagram-post-reels-stories-downloader.p.rapidapi.com"
            }
        });
        const urls = response.data.result.map((item: { url: string }) => item.url);
        return urls;
    } catch (error) {
        return [];
    }
}

export async function igStory(url: string): Promise<IGStoryResult[]> {
    try {
        const urls = `https://instagram.com/stories/${url}`;
        const response = await axios.post(
            'https://v3.saveig.app/api/ajaxSearch',
            `q=${encodeURIComponent(urls)}&t=media&lang=en`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Accept: '*/*',
                },
            }
        );

        const data = response.data.data;
        const $ = cheerio.load(data);
        const results: IGStoryResult[] = [];

        $('.download-items').each((_, element) => {
            const thumbnail = $(element).find('.download-items__thumb img').attr('src');
            const download = $(element).find('.download-items__btn a').attr('href');

            results.push({
                author: 'XYZ TEAM',
                thumb: thumbnail || '',
                url: download || '',
            });
        });

        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function mediafire(url: string): Promise<MediafireData> {
    try {
        if (!/mediafire\.com\/file\//gi.test(url)) {
            throw new Error("Invalid URL");
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const button = $(".dl-btn-cont");
        const dlinfo = $(".dl-info");

        const data: MediafireData = {
            name: button.find("div.dl-btn-label").text().trim(),
            filename: button.find("div.dl-btn-label").attr("title"),
            type: path.extname(button.find("div.dl-btn-label").attr("title") || ""),
            size: dlinfo.find("ul.details li > span").eq(0).text().trim(),
            created: new Date(dlinfo.find("ul.details li > span").eq(1).text().trim()),
            descHeader: dlinfo.find("div.description > p").eq(0).text().trim(),
            desc: dlinfo.find("div.description > p").eq(1).text().trim(),
            media: button.find("a.popsok").attr("href"),
            link: url,
        };

        return data;
    } catch (error) {
        throw error;
    }
}

export async function pindl(url: string): Promise<PindlResult> {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get("https://www.savepin.app/download.php?url=" + url + "&lang=en&type=redirect");
            const $ = cheerio.load(data);
            const title = $(".content p strong").text().trim();
            const thumbnail = $(".image.is-64x64 img").attr("src");
            const download: PindlDownload[] = [];

            $("tbody tr").each((_i, el) => {
                const quality = $(el).find(".video-quality").text().trim();
                const format = $(el).find("td").eq(1).text().trim();
                const link = "https://www.savepin.app/" + $(el).find("a").attr("href");
                download.push({ quality, format, link });
            });

            resolve({ title, thumbnail, download });
        } catch (err) {
            reject(err);
        }
    });
};

export async function samehadaku(url: string): Promise<samehadakuData> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!/samehadaku\.email/gi.test(url)) return reject("Invalid URL!");

            const htmlResponse = await axios.get(url, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                },
            });

            const $ = cheerio.load(htmlResponse.data);
            const data: samehadakuData = {
                title: $('h1[itemprop="name"]').text().trim(),
                link: url,
                downloads: [],
            };

            const downloadPromises = $("div#server > ul > li").map(async (_i, el) => {
                const v: samehadakuDownload = {
                    name: $(el).find("span").text().trim(),
                    post: $(el).find("div").attr("data-post") || '',
                    nume: $(el).find("div").attr("data-nume") || '',
                    type: $(el).find("div").attr("data-type") || '',
                    link: '',
                };

                const formData = new FormData();
                formData.append("action", "player_ajax");
                formData.append("post", v.post);
                formData.append("nume", v.nume);
                formData.append("type", v.type);

                const response = await axios.post(
                    "https://samehadaku.email/wp-admin/admin-ajax.php",
                    formData,
                    {
                        headers: {
                            'User-Agent':
                                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                            'Origin': 'https://samehadaku.email',
                            ...formData.getHeaders(),
                        },
                    }
                );

                v.link = cheerio.load(response.data)("iframe").attr("src") || '';

                return v;
            }).get();

            data.downloads = await Promise.all(downloadPromises);

            resolve(data);
        } catch (e) {
            reject(e);
        }
    });
}

export function snackvideoV1(url: string): Promise<SnackVideoResult> {
    return new Promise(async (resolve, reject) => {
        const form = new FormData();
        form.append("id", url);

        try {
            const response: AxiosResponse<string> = await axios.post('https://getsnackvideo.com/results', form, {
                headers: {
                    ...form.getHeaders(),
                },
            });

            const $ = cheerio.load(response.data);
            const result: SnackVideoResult = {
                creator: "XYZ TEAM",
                url: $("td.text-right > a.download_link").attr("href") ?? undefined,
                thumb: $(".img_thumb > img").attr("src") ?? undefined,
            };

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export function snackvideoV2(url: string): Promise<SnackVideoData> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!/snackvideo.com/gi.test(url)) return reject("Invalid URL!");

            const res = await fetch(url).then((response) => response.text());
            const $ = cheerio.load(res);
            const video = $("div.video-box").find("a-video-player");
            const author = $("div.author-info");
            const attr = $("div.action");
            const data: SnackVideoData = {
                title: $(author)
                    .find("div.author-desc > span")
                    .children("span")
                    .eq(0)
                    .text()
                    .trim(),
                thumbnail: $(video)
                    .parent()
                    .siblings("div.background-mask")
                    .children("img")
                    .attr("src") ?? undefined,
                media: $(video).attr("src") ?? undefined,
                author: $("div.author-name").text().trim(),
                authorImage: $(attr).find("div.avatar > img").attr("src") ?? undefined,
                like: $(attr).find("div.common").eq(0).text().trim(),
                comment: $(attr).find("div.common").eq(1).text().trim(),
                share: $(attr).find("div.common").eq(2).text().trim(),
            };

            resolve(data);
        } catch (e) {
            reject(e);
        }
    });
}

export function spotifydl(url: string): Promise<SpotifyResponse> {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://spotifydownloaders.com/api/getSpotifyDetails?url=${url}`);
            const metadata: SpotifyMetadata = {
                createdDate: data.preview.date,
                title: data.preview.title,
                type: data.preview.type,
                thumbnail: data.preview.image,
                artist: data.preview.artist,
                duration: {
                    duration: data.tracks[0].duration,
                    time: data.tracks[0].time
                }
            };
            const buffer = await fetchBuffer(`https://spotifydownloaders.com/api/spotify?url=${url}`);

            resolve({
                creator: "XYZ TEAMS",
                buffer,
                metadata
            });
        } catch (error) {
            reject(error);
        }
    });
}

export async function terabox(url: string): Promise<TeraboxResponse> {
    try {
        const response = await axios.get(`https://tera.instavideosave.com/?url=${encodeURIComponent(url)}`);
        const res: TeraboxResponse = {
            status: true,
            data: response.data
        };
        return res;
    } catch (error) {
        console.error('Error fetching data from terabox:', error);
        const res: TeraboxResponse = {
            status: false,
            message: 'Error fetching data from terabox'
        };

        return res;
    }
}

export async function threads(url: string): Promise<ThreadsResponse | undefined> {
    try {
        const response = await axios.get<ThreadsResponse>(`https://api.threadsphotodownloader.com/v2/media?url=${encodeURIComponent(url)}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function tiktokdl(url: string): Promise<TikTokDLResult> {
    let result: TikTokDLResult = { status: true };
    let form = new FormData();
    form.append("q", url);
    form.append("lang", "id");

    try {
        let { data } = await axios("https://savetik.co/api/ajaxSearch", {
            method: "post",
            data: form,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "User-Agent": "PostmanRuntime/7.32.2"
            }
        });

        let $ = cheerio.load(data.data);

        result.creator = "XYZ TEAMS";
        result.caption = $("div.video-data > div > .tik-left > div > .content > div > h3").text();
        result.url = $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href");
        result.audio = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href");

    } catch (error) {
        result.status = false;
        result.message = error;
        console.log(result);
    }

    return result;
}

export async function ttslide(url: string): Promise<string[] | null> {
    try {
        const res = await axios({
            method: 'POST',
            url: 'https://tikvideo.app/api/ajaxSearch',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            },
            data: {
                "q": url,
                "lang": "id"
            }
        });

        let result: string[] = [];
        if (res.data.status === 'ok') {
            let $ = cheerio.load(res.data.data);
            $('img').each((_i, element) => {
                const src = $(element).attr('src');
                if (src && !src.includes('.webp')) {
                    result.push(src);
                }
            });
        }
        return result.length > 0 ? result : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function twitter(link: string): Promise<TwitterMedia> {
    try {
        const config = new URLSearchParams();
        config.append('URL', link);

        const response = await axios.post('https://twdown.net/download.php', config.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
            }
        });

        const $ = cheerio.load(response.data);
        const desc = $('div:nth-child(1) > div:nth-child(2) > p').text().trim();
        const thumb = $('div:nth-child(1) > img').attr('src');
        const video_sd = $('tr:nth-child(2) > td:nth-child(4) > a').attr('href');
        const video_hd = $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href');
        const audio = $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a').attr('href');

        return {
            desc,
            thumb,
            video_sd,
            video_hd,
            audio: audio ? `https://twdown.net/${audio}` : undefined,
        };
    } catch (error) {
        throw new Error("Failed to fetch Twitter data. Please try again later.");
    }
}

export function ytmp4(url: string): Promise<DownloadResponse> {
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

export function ytmp3(url: string): Promise<DownloadResponse> {
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

export function search(query: string): Promise<VideoDetails[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const response: SearchResult = await yts(query);
            const result: VideoDetails[] = response.videos.map((video: VideoSearchResult) => ({
                title: video.title,
                url: video.url,
                thumbnail: video.image,
                duration: {
                    seconds: video.seconds,
                    timestamp: video.timestamp,
                },
                views: video.views,
                publish: video.ago,
            }));
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

export async function quote(text: string, ppurl: string, nickname: string): Promise<any> {
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

export async function igstalk(user: string): Promise<IgStalkResult> {
    try {
        const response = await axios.get(`https://igram.world/api/ig/userInfoByUsername/${user.replace(/[^\w\d]/gi, "")}`);

        const data = response.data.result as IgStalkResult;

        return data;
    } catch (error) {
        throw error;
    }
}

export async function pinsearch(query: string): Promise<string[]> {
    try {
        const response = await axios.get(`https://id.pinterest.com/search/pins/?autologin=true&q=${query}`, {
            headers: {
                "cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
            }
        });

        const $ = cheerio.load(response.data);
        const result: string[] = [];
        const hasil: string[] = [];

        $('div > a').each((_, element) => {
            const link = $(element).find('img').attr('src');
            result.push(link || '');
        });

        result.forEach((v) => {
            if (v) {
                hasil.push(v.replace(/236/g, '736'));
            }
        });

        hasil.shift();
        return hasil;
    } catch (error) {
        throw new Error(`Error fetching Pinterest data: ${(error as Error).message || error}`);
    }
};

export async function getStickers(query: string, type: string = "sticker", page: number = 1): Promise<StickerData> {
    const url = `https://www.flaticon.com/search/${page}?word=${encodeURI(query)}&type=${type}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data: StickerData = {
        total_get: $("p#total_icon_badge").text().trim(),
        page: page,
        stickers: []
    };

    $("ul.icons").find("li[data-id]").each((_, element) => {
        const sticker: { [key: string]: string } = {};
        const attributes = $(element).attr() as { [key: string]: string };
        for (const [key, value] of Object.entries(attributes)) {
            if (!key.startsWith("data-")) continue;
            sticker[key.replace("data-", "")] = value;
        }
        data.stickers.push(sticker);
    });

    return data;
}

export async function tiktokSearch(query: string): Promise<TikTokVideo[]> {
    try {
        const response = await axios.post("https://tikwm.com/api/feed/search", new URLSearchParams({
            keywords: query,
            count: '10',
            cursor: '0',
            HD: '1'
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                Cookie: "current_language=en",
                "User-Agent": "Mozilla/5.0 (Linux Android 10 K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            }
        });

        const videos = response.data.data.videos;
        if (videos.length === 0) {
            throw new Error("Tidak ada video ditemukan.");
        } else {
            return videos.map((v: any) => ({
                title: v.title,
                cover: v.cover,
                origin_cover: v.origin_cover,
                link: `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`,
                no_watermark: v.play,
                watermark: v.wmplay,
                music: v.music_info,
                views: v.play_count,
                like: v.digg_count,
                comment: v.comment_count || null,
                share: v.share_count,
                download: v.download_count || null,
                save: v.collect_count || null,
                create_time: v.create_time * 1000,
            }));
        }
    } catch (error) {
        throw error;
    }
}

export async function Khodam(nama: string): Promise<KhodamResult> {
    return new Promise<KhodamResult>(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://khodam.vercel.app/v2?nama=${nama}`);
            const $ = cheerio.load(data);

            const khodam = $('span.__className_cad559.text-3xl.font-bold.text-rose-600').text().trim();
            const result: KhodamResult = {
                nama,
                khodam,
                share: `https://khodam.vercel.app/v2?nama=${nama}&share`
            };
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export async function Gempa(): Promise<GempaResult> {
    try {
        const response = await axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg');
        const $ = cheerio.load(response.data);
        const urlElems = $('table.table-hover.table-striped');

        for (let i = 0; i < urlElems.length; i++) {
            const urlSpan = $(urlElems[i]).find('tbody')[0];

            if (urlSpan) {
                const urlData = $(urlSpan).find('tr')[0];
                const Kapan = $(urlData).find('td')[1];
                const Letak = $(urlData).find('td')[2];
                const Magnitudo = $(urlData).find('td')[3];
                const Kedalaman = $(urlData).find('td')[4];
                const Wilayah = $(urlData).find('td')[5];
                const lintang = $(Letak).text().split(' ')[0];
                const bujur = $(Letak).text().split(' ')[2];
                const hasil: GempaResult = {
                    status: true,
                    code: 200,
                    result: {
                        Waktu: $(Kapan).text(),
                        Lintang: lintang ?? '',
                        Bujur: bujur ?? '',
                        Magnitudo: $(Magnitudo).text(),
                        Kedalaman: $(Kedalaman).text().replace(/\t/g, '').replace(/I/g, ''),
                        Wilayah: $(Wilayah).text().replace(/\t/g, '').replace(/I/g, '').replace('-', '').replace(/\r/g, '').split('\n')[0] ?? '',
                        Map: $('div.row > div > img').attr('src')
                    }
                };
                return hasil;
            }
        }
        throw new Error('No data found');
    } catch (err) {
        throw new Error(`Error: ${err}`);
    }
}

export async function ngl(username: string, pesan: string): Promise<NGLResponse> {
    try {
        const res = await axios.post(
            'https://ngl.link/api/submit',
            `username=${encodeURIComponent(username)}&question=${encodeURIComponent(pesan)}&deviceId=18d7b980-ac6a-4878-906e-087dfec6ea1b&gameSlug=&referrer=`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return {
            creator: 'XYZ TEAM',
            response: res.data,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function quotes(input: string): Promise<QuoteResponse> {
    return new Promise((resolve, reject) => {
        const url = `https://jagokata.com/kata-bijak/kata-${input.replace(/\s/g, '_')}.html?page=1`;

        axios.get(url)
            .then(response => {
                const $ = cheerio.load(response.data);
                const data: Quote[] = [];

                $('div[id="main"]').find('ul[id="citatenrijen"] > li').each((index, element) => {
                    const number = index + 1;
                    const author = $(element).find('div[class="citatenlijst-auteur"] > a').text().trim();
                    const bio = $(element).find('span[class="auteur-beschrijving"]').text().trim();
                    const quote = $(element).find('q[class="fbquote"]').text().trim();
                    data.push({ number, author, bio, quote });
                });

                data.splice(2, 1);

                if (data.length === 0) {
                    return resolve({ status: false });
                }
                resolve({ status: true, data });
            })
            .catch(reject);
    });
}

export function quotesanime(): Promise<QuoteAnime[]> {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 184);
        const url = `https://otakotaku.com/quote/feed/${page}`;

        axios.get(url)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const hasil: QuoteAnime[] = [];

                $('div.kotodama-list').each((_, element) => {
                    hasil.push({
                        link: $(element).find('a').attr('href') || '',
                        gambar: $(element).find('img').attr('data-src') || '',
                        karakter: $(element).find('div.char-name').text().trim(),
                        anime: $(element).find('div.anime-title').text().trim(),
                        episode: $(element).find('div.meta').text().trim(),
                        up_at: $(element).find('small.meta').text().trim(),
                        quotes: $(element).find('div.quote').text().trim()
                    });
                });

                resolve(hasil);
            })
            .catch(reject);
    });
}

export async function removebg(path: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!path) reject("Required Path Or Url");

            if (path.match(/^https?:\/\//)) {
                const imageBuffer = await axios.get(path, { responseType: "arraybuffer" }).then((r) => r.data);
                writeFileSync("images.png", imageBuffer);
                path = "images.png";
            }

            const host = await axios.get("https://www.onlineconverter.com/get/host", {
                headers: {
                    authority: "www.onlineconverter.com",
                    accept: "/",
                    "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
                    referer: "https://www.onlineconverter.com/remove-image-background",
                    "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": '"Android"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                },
            });

            const url = host.data;
            const buffer = readFileSync(path);
            const ext = path.split('.').pop();
            const form = new FormData();
            form.append("file", buffer, {
                filename: `${Date.now()}.${ext}`,
            });
            form.append("select", "1");
            form.append("class", "tool");
            form.append("from", "image");
            form.append("to", "remove-image-background");
            form.append("source", "online");

            const upload = await axios.post(url, form, {
                headers: {
                    ...form.getHeaders(),
                    authority: url,
                    accept: "/",
                    "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
                    origin: "https://www.onlineconverter.com",
                    referer: "https://www.onlineconverter.com/",
                    "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": '"Android"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                },
            });

            const result = upload.data;
            const id = result.match(/(?:convert\/)(\w+)/)[1];
            const res = `${url.split("/send").join("")}/${id}`;
            unlinkSync(path);
            sleep(2000)
            resolve(res + "/download");
        } catch (error) {
            reject(error);
        }
    });
}

export function servermc(): Promise<ServerData[]> {
    return new Promise((resolve, reject) => {
        axios.get('https://minecraftpocket-servers.com/country/indonesia/')
            .then(response => {
                const $ = cheerio.load(response.data);
                const hasil: ServerData[] = [];

                $('tr').each((_, element) => {
                    const ip = $(element).find('button.btn.btn-secondary.btn-sm').eq(1).text().trim().split(':').shift();
                    const port = parseInt($(element).find('button.btn.btn-secondary.btn-sm').eq(1).text().trim().split(':').pop() || '0', 10);
                    const versi = $(element).find('a.btn.btn-info.btn-sm').text();
                    const player = $(element).find('td.d-none.d-md-table-cell > strong').eq(1).text().trim();

                    if (ip) { // Ensure ip is not empty
                        const data: ServerData = {
                            ip,
                            port,
                            versi,
                            player,
                        };
                        hasil.push(data);
                    }
                });

                resolve(hasil);
            })
            .catch(reject);
    });
}

export function ssweb(url: string, device: string): Promise<Buffer> {
    const baseURL = 'https://www.screenshotmachine.com';
    const params = new URLSearchParams({ url, device, cacheLimit: '0' });

    return axios.post(`${baseURL}/capture.php`, params, {
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).then(response => {
        if (response.data.status === 'success') {
            const link = response.data.link;
            const cookies = response.headers['set-cookie']?.join('') || '';

            return axios.get(`${baseURL}/${link}`, {
                headers: { cookie: cookies },
                responseType: 'arraybuffer'
            }).then(res => res.data);
        } else {
            throw new Error('ScreenshotMachine request failed.');
        }
    }).catch(error => {
        throw error;
    });
}

export function styleText(text: string): Promise<StyledText[]> {
    return axios.get(`http://qaz.wtf/u/convert.cgi?text=${text}`)
        .then(({ data }) => {
            const $ = cheerio.load(data);
            const result: StyledText[] = [];
            $('table > tbody > tr').each((_, element) => {
                result.push({
                    author: 'XYZ TEAMS',
                    text: $(element).find('td:nth-child(2)').text().trim()
                });
            });
            return result;
        });
}