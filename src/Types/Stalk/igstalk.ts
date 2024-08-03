import axios from 'axios';

interface IgStalkResult {
    username: string;
    full_name: string;
    profile_pic_url_hd: string;
    biography: string;
    followers_count: number;
    following_count: number;
    is_private: boolean;
}

export default async function igstalk(user: string): Promise<IgStalkResult> {
    try {
        const response = await axios.get(`https://igram.world/api/ig/userInfoByUsername/${user.replace(/[^\w\d]/gi, "")}`);

        const data = response.data.result as IgStalkResult;

        return data;
    } catch (error) {
        throw error;
    }
}