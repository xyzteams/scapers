import axios from 'axios';
import FormData from 'form-data';
import yts, { SearchResult, VideoSearchResult } from "yt-search"

interface MediaInfo {
    url: string;
    size: number;
    quality: string;
    formattedSize: string;
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

interface YouTubeResult {
    title: string;
    thumbnail: string;
    duration: string;
    video: MediaInfo;
    audio: MediaInfo;
}

export function youtube(url: string): Promise<YouTubeResult> {
    return new Promise(async (resolve, reject) => {
        try {
            const form = new FormData();
            form.append("url", url);

            const { data } = await axios.post("https://www.aiodownloader.in/wp-json/aio-dl/video-data/", form, {
                headers: form.getHeaders()
            });

            const res: YouTubeResult = {
                title: data.title,
                thumbnail: data.thumbnail,
                duration: data.duration,
                video: {
                    url: data.medias[0].url,
                    size: data.medias[0].size,
                    quality: data.medias[0].quality,
                    formattedSize: data.medias[0].formattedSize
                },
                audio: {
                    url: data.medias[5].url,
                    size: data.medias[5].size,
                    quality: data.medias[5].quality,
                    formattedSize: data.medias[5].formattedSize
                }
            };

            resolve(res);

        } catch (error) {
            reject(error);
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
