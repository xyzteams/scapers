import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

interface SnackVideoResult {
    creator: string;
    url: string | undefined;
    thumb: string | undefined;
}

interface SnackVideoData {
    title: string;
    thumbnail: string | undefined;
    media: string | undefined;
    author: string;
    authorImage: string | undefined;
    like: string;
    comment: string;
    share: string;
}

export function v1(url: string): Promise<SnackVideoResult> {
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

export function v2(url: string): Promise<SnackVideoData> {
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