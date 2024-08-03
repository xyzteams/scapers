import axios from 'axios';
import cheerio from 'cheerio';

interface TwitterMedia {
    desc: string;
    thumb: string | undefined;
    video_sd: string | undefined;
    video_hd: string | undefined;
    audio: string | undefined;
}

export default async function twitter(link: string): Promise<TwitterMedia> {
    try {
        const config = new URLSearchParams();
        config.append('URL', link);

        const response = await axios.post('https://twdown.net/download.php', config.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
            }
        });

        const $ = cheerio.load(response.data);
        const desc = $('div:nth-child(1) > div:nth-child(2) > p').text().trim();
        const thumb = $('div:nth-child(1) > img').attr('src');
        const video_sd = $('tr:nth-child(2) > td:nth-child(4) > a').attr('href');
        const video_hd = $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href');
        const audio = $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a').attr('href');

        return {
            desc,
            thumb,
            video_sd,
            video_hd,
            audio: audio ? `https://twdown.net/${audio}` : undefined,
        };
    } catch (error) {
        throw new Error("Failed to fetch Twitter data. Please try again later.");
    }
}