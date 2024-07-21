import axios from 'axios';
import cheerio from 'cheerio';

interface Quote {
    link: string;
    gambar: string;
    karakter: string;
    anime: string;
    episode: string;
    up_at: string;
    quotes: string;
}

export default function quotesanime(): Promise<Quote[]> {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 184);
        const url = `https://otakotaku.com/quote/feed/${page}`;

        axios.get(url)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const hasil: Quote[] = [];

                $('div.kotodama-list').each((_, element) => {
                    hasil.push({
                        link: $(element).find('a').attr('href') || '',
                        gambar: $(element).find('img').attr('data-src') || '',
                        karakter: $(element).find('div.char-name').text().trim(),
                        anime: $(element).find('div.anime-title').text().trim(),
                        episode: $(element).find('div.meta').text().trim(),
                        up_at: $(element).find('small.meta').text().trim(),
                        quotes: $(element).find('div.quote').text().trim()
                    });
                });

                resolve(hasil);
            })
            .catch(reject);
    });
}
