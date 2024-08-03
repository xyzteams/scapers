import axios from 'axios';

interface ThreadsResponse {
    media: {
        url: string;
        type: string;
        [key: string]: any;
    };
}

export default async function threads(url: string): Promise<ThreadsResponse | undefined> {
    try {
        const response = await axios.get<ThreadsResponse>(`https://api.threadsphotodownloader.com/v2/media?url=${encodeURIComponent(url)}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}