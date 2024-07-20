import axios from 'axios';
import cheerio from 'cheerio';

interface KhodamResult {
    nama: string;
    khodam: string;
    share: string;
}

export default async function Khodam(nama: string): Promise<KhodamResult> {
    return new Promise<KhodamResult>(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://khodam.vercel.app/v2?nama=${nama}`);
            const $ = cheerio.load(data);

            const khodam = $('span.__className_cad559.text-3xl.font-bold.text-rose-600').text().trim();
            const result: KhodamResult = {
                nama,
                khodam,
                share: `https://khodam.vercel.app/v2?nama=${nama}&share`
            };
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}
