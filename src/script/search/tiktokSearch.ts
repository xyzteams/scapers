import axios from 'axios';

interface TikTokVideo {
    title: string;
    cover: string;
    origin_cover: string;
    link: string;
    no_watermark: string;
    watermark: string;
    music: any;
    views: number;
    like: number;
    comment: number | null;
    share: number;
    download: number | null;
    save: number | null;
    create_time: number;
}

export default async function tiktokSearch(query: string): Promise<TikTokVideo[]> {
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
