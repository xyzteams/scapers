import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';

interface MediafireData {
    name: string;
    filename: string | undefined;
    type: string;
    size: string;
    created: Date;
    descHeader: string;
    desc: string;
    media: string | undefined;
    link: string;
}

export default async function mediafire(url: string): Promise<MediafireData> {
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
