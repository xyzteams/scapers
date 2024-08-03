import axios from 'axios';

interface NGLResponse {
    creator: string;
    response: any;
}

export default async function ngl(username: string, pesan: string): Promise<NGLResponse> {
    try {
        const res = await axios.post(
            'https://ngl.link/api/submit',
            `username=${encodeURIComponent(username)}&question=${encodeURIComponent(pesan)}&deviceId=18d7b980-ac6a-4878-906e-087dfec6ea1b&gameSlug=&referrer=`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return {
            creator: 'XYZ TEAM',
            response: res.data,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}