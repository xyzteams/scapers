import axios from 'axios';

interface AioResponse {
    url: string;
}

export default async function aio(url: string): Promise<string> {
    try {
        const response = await axios.post<AioResponse>(
            "https://api.cobalt.tools/api/json",
            { url },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }
        );

        return response.data.url;
    } catch (error) {
        console.error("Failed to fetch Aio data:", error);
        throw new Error("Failed to fetch Aio data. Please try again later.");
    }
}
