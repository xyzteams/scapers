import axios from 'axios';
import cheerio from 'cheerio';

interface StickerData {
    total_get: string;
    page: number;
    stickers: {
        [key: string]: string;
    }[];
}

export default async function getStickers(query: string, type: string = "sticker", page: number = 1): Promise<StickerData> {
    const url = `https://www.flaticon.com/search/${page}?word=${encodeURI(query)}&type=${type}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data: StickerData = {
        total_get: $("p#total_icon_badge").text().trim(),
        page: page,
        stickers: []
    };

    $("ul.icons").find("li[data-id]").each((_, element) => {
        const sticker: { [key: string]: string } = {};
        const attributes = $(element).attr() as { [key: string]: string };
        for (const [key, value] of Object.entries(attributes)) {
            if (!key.startsWith("data-")) continue;
            sticker[key.replace("data-", "")] = value;
        }
        data.stickers.push(sticker);
    });

    return data;
}
