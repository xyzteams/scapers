import axios from 'axios';

export interface AIResponse {
    data: any;
}

export default async function ainews(question: string): Promise<AIResponse | null> {
    try {
        const response = await axios.post<AIResponse>('https://api.hai.news/question', {
            chat_id: '9ea5fef5-bbea-4e13-a3d8-3998bb58d344',
            question,
            storage_path: '/var/www/hai.news/storage/app/public/',
            temperature: 0.8,
            tokens: 10000000,
            language: 'en'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Android 12; Mobile; rv:130.0) Gecko/130.0 Firefox/130.0',
                'Referer': 'https://hai.news/news/9ea5fef5-bbea-4e13-a3d8-3998bb58d344'
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}