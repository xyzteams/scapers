import FormData from 'form-data';
import cheerio from 'cheerio';
import axios from 'axios';

const base = 'https://m.photofunia.com';

interface SearchResult {
    judul: string;
    desc: string;
    thumb: string;
    link: string;
}

interface EffectResult {
    judul: string;
    desc: string;
    exam: string;
    inputs: { input: string }[];
}

interface ErrorResult {
    error: string;
}

async function photofunSearch(teks: string): Promise<SearchResult[]> {
    const res = await axios.get(`${base}/search?q=${teks}`);
    const $ = cheerio.load(res.data);
    const hasil: SearchResult[] = [];

    $('ul > li > a.effect').each((_, element) => {
        const judul = $(element).find('span > span.name').text().trim();
        const desc = $(element).find('span > span.description').text();
        const thumb = $(element).find('img').attr('src') || '';
        const link = `${base}${$(element).attr('href')}`;
        hasil.push({ judul, desc, thumb, link });
    });

    return hasil;
}

async function photofunEffect(url: string): Promise<EffectResult | ErrorResult> {
    if (!url.includes(base)) return { error: 'Link Tidak Valid' };

    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const hasil: EffectResult = {
        judul: $('div > h2').text(),
        desc: $('div.description').text(),
        exam: $('div > div.image-preview > a > img').attr('src') || '',
        inputs: []
    };

    $('form > div > input').each((_, element) => {
        const input = $(element).attr('name');
        if (input) {
            hasil.inputs.push({ input });
        }
    });

    return hasil;
}

async function photofunUse(teks: string, url: string): Promise<string | ErrorResult> {
    if (!url.includes(base)) return { error: 'Link Tidak Valid' };

    const form = new FormData();
    form.append('text', teks);

    try {
        const res = await axios.post(url, form, {
            headers: {
                'User-Agent': 'GoogleBot',
                ...form.getHeaders()
            }
        });
        const $ = cheerio.load(res.data);
        const gambar = $('div.image-container').find('img').attr('src') || '';

        return gambar;
    } catch (error) {
        return { error: 'Failed to process the request' };
    }
}

export { photofunSearch, photofunEffect, photofunUse };
