import axios from 'axios';
import cheerio from 'cheerio';

interface Quote {
    number: number;
    author: string;
    bio: string;
    quote: string;
}

interface QuoteResponse {
    status: boolean;
    data?: Quote[];
}

export default function quotes(input: string): Promise<QuoteResponse> {
    return new Promise((resolve, reject) => {
        const url = `https://jagokata.com/kata-bijak/kata-${input.replace(/\s/g, '_')}.html?page=1`;

        axios.get(url)
            .then(response => {
                const $ = cheerio.load(response.data);
                const data: Quote[] = [];

                $('div[id="main"]').find('ul[id="citatenrijen"] > li').each((index, element) => {
                    const number = index + 1;
                    const author = $(element).find('div[class="citatenlijst-auteur"] > a').text().trim();
                    const bio = $(element).find('span[class="auteur-beschrijving"]').text().trim();
                    const quote = $(element).find('q[class="fbquote"]').text().trim();
                    data.push({ number, author, bio, quote });
                });

                data.splice(2, 1);

                if (data.length === 0) {
                    return resolve({ status: false });
                }
                resolve({ status: true, data });
            })
            .catch(reject);
    });
}