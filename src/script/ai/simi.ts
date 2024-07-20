import axios from 'axios';

export default async function simi(text: string): Promise<string> {
    try {
        const api = 'https://api.simsimi.vn/v1/simtalk';
        const params = new URLSearchParams({
            text,
            lc: 'id',
            key: ''
        });

        const response = await axios.post(api, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return response.data.message;
    } catch (error) {
        console.error('Error occurred while communicating with Simsimi API:', error);
        return 'Unexpected error occurred. Please try again later.';
    }
}
