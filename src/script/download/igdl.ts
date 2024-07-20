import axios from 'axios';

interface IGDLResult {
    status: boolean;
    media?: string[];
    message?: string;
}

export default async function igdl(url: string): Promise<IGDLResult> {
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
