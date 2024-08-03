import axios from 'axios';

interface TeraboxResponse {
    status: boolean;
    data?: any;
    message?: string;
}

export default async function terabox(url: string): Promise<TeraboxResponse> {
    try {
        const response = await axios.get(`https://tera.instavideosave.com/?url=${encodeURIComponent(url)}`);
        const res: TeraboxResponse = {
            status: true,
            data: response.data
        };
        return res;
    } catch (error) {
        console.error('Error fetching data from terabox:', error);
        const res: TeraboxResponse = {
            status: false,
            message: 'Error fetching data from terabox'
        };

        return res;
    }
}