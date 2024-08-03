import axios from 'axios';
import cheerio from 'cheerio';

interface IGStoryResult {
    author: string;
    thumb: string;
    url: string;
}

export default async function igStory(url: string): Promise<IGStoryResult[]> {
    try {
        const urls = `https://instagram.com/stories/${url}`;
        const response = await axios.post(
            'https://v3.saveig.app/api/ajaxSearch',
            `q=${encodeURIComponent(urls)}&t=media&lang=en`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Accept: '*/*',
                },
            }
        );

        const data = response.data.data;
        const $ = cheerio.load(data);
        const results: IGStoryResult[] = [];

        $('.download-items').each((_, element) => {
            const thumbnail = $(element).find('.download-items__thumb img').attr('src');
            const download = $(element).find('.download-items__btn a').attr('href');

            results.push({
                author: 'XYZ TEAM',
                thumb: thumbnail || '',
                url: download || '',
            });
        });

        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}