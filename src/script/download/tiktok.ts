import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

interface TikTokDLResult {
    creator?: string;
    status: boolean;
    caption?: string;
    url?: string;
    audio?: string;
    message?: any;
}

export default async function tiktokdl(url: string): Promise<TikTokDLResult> {
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