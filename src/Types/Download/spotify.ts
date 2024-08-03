import axios from "axios";
import { fetchBuffer } from "../../Utils/functions.js";

interface SpotifyMetadata {
    createdDate: string;
    title: string;
    type: string;
    thumbnail: string;
    artist: string;
    duration: {
        duration: string;
        time: string;
    };
}

interface SpotifyResponse {
    creator: string;
    buffer: Buffer;
    metadata: SpotifyMetadata;
}

export default function spotifydl(url: string): Promise<SpotifyResponse> {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://spotifydownloaders.com/api/getSpotifyDetails?url=${url}`);
            const metadata: SpotifyMetadata = {
                createdDate: data.preview.date,
                title: data.preview.title,
                type: data.preview.type,
                thumbnail: data.preview.image,
                artist: data.preview.artist,
                duration: {
                    duration: data.tracks[0].duration,
                    time: data.tracks[0].time
                }
            };
            const buffer = await fetchBuffer(`https://spotifydownloaders.com/api/spotify?url=${url}`);

            resolve({
                creator: "XYZ TEAMS",
                buffer,
                metadata
            });
        } catch (error) {
            reject(error);
        }
    });
}