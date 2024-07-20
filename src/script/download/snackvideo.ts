import axios from 'axios';
import cheerio from 'cheerio';

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

export default async function snackVideo(url: string): Promise<SnackVideoData> {
    try {
        if (!/snackvideo\.com/gi.test(url)) {
            throw new Error("Invalid URL!");
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const video = $("div.video-box").find("a-video-player");
        const author = $("div.author-info");
        const attr = $("div.action");

        const data: SnackVideoData = {
            title: $(author).find("div.author-desc > span").children("span").eq(0).text().trim(),
            thumbnail: $(video).parent().siblings("div.background-mask").children("img").attr("src"),
            media: $(video).attr("src"),
            author: $("div.author-name").text().trim(),
            authorImage: $(attr).find("div.avatar > img").attr("src"),
            like: $(attr).find("div.common").eq(0).text().trim(),
            comment: $(attr).find("div.common").eq(1).text().trim(),
            share: $(attr).find("div.common").eq(2).text().trim(),
        };

        return data;
    } catch (error) {
        throw error;
    }
}
