import axios from 'axios';

interface VideoInfo {
    creator: string;
    title: string;
    thumbnail: string;
    duration: {
        seconds: number;
        formatted: string;
    };
    quality: string;
    url: string;
}

export default function getVideoInfo(url: string): Promise<VideoInfo> {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://cdn35.savetube.me/info?url=${url}`);
            const result: VideoInfo = {
                creator: "XYZ TEAM",
                title: data.data.title,
                thumbnail: data.data.thumbnail,
                duration: {
                    seconds: data.data.duration,
                    formatted: data.data.durationLabel,
                },
                quality: data.data.video_formats[0].quality,
                url: data.data.video_formats[0].url,
            };
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}