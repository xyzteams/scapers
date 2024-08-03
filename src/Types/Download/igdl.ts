import axios from 'axios';

interface IGDLResult {
    status: boolean;
    media?: string[];
    message?: string;
}

export async function v1(url: string): Promise<IGDLResult> {
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

export async function v2(url: string): Promise<string[]> {
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