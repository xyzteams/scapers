import axios from "axios";
import yts, { SearchResult, VideoSearchResult } from "yt-search";

interface DownloadResponse {
    [key: string]: any;
}

interface VideoDetails {
    title: string;
    url: string;
    thumbnail: string;
    duration: {
        seconds: number;
        timestamp: string;
    };
    views: number;
    publish: string;
}

function ytmp4(url: string): Promise<DownloadResponse> {
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

function ytmp3(url: string): Promise<DownloadResponse> {
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

function search(query: string): Promise<VideoDetails[]> {
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

export { ytmp4, ytmp3, search };
