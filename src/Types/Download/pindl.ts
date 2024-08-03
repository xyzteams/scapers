import axios from "axios";
import cheerio from "cheerio";

interface Download {
    quality: string;
    format: string;
    link: string;
}

interface PindlResult {
    title: string;
    thumbnail: string | undefined;
    download: Download[];
}

const pindl = async (url: string): Promise<PindlResult> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get("https://www.savepin.app/download.php?url=" + url + "&lang=en&type=redirect");
            const $ = cheerio.load(data);
            const title = $(".content p strong").text().trim();
            const thumbnail = $(".image.is-64x64 img").attr("src");
            const download: Download[] = [];

            $("tbody tr").each((_i, el) => {
                const quality = $(el).find(".video-quality").text().trim();
                const format = $(el).find("td").eq(1).text().trim();
                const link = "https://www.savepin.app/" + $(el).find("a").attr("href");
                download.push({ quality, format, link });
            });

            resolve({ title, thumbnail, download });
        } catch (err) {
            reject(err);
        }
    });
};

export default pindl;