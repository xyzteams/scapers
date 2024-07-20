import axios from 'axios';
import cheerio from 'cheerio';

export default async function ttslide(url: string): Promise<string[] | null> {
    try {
        const res = await axios({
            method: 'POST',
            url: 'https://tikvideo.app/api/ajaxSearch',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            },
            data: {
                "q": url,
                "lang": "id"
            }
        });

        let result: string[] = [];
        if (res.data.status === 'ok') {
            let $ = cheerio.load(res.data.data);
            $('img').each((_i, element) => {
                const src = $(element).attr('src');
                if (src && !src.includes('.webp')) {
                    result.push(src);
                }
            });
        }
        return result.length > 0 ? result : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}