import axios from "axios";
import formData from "form-data";

export default async function aio(url: string): Promise<{ url: string, size: string }[]> {
    return new Promise(async (resolve, reject) => {
        const form = new formData();
        form.append("url", url);
        await axios({
            url: "https://www.aiodownloader.in/wp-json/aio-dl/video-data",
            method: "post",
            data: form
        }).then(({ data }) => {
            const res: PromiseLike<{ url: string; size: string; }[]> | { url: any; size: any; }[] = []
            data.medias.map((e: { url: any; formattedSize: any; }) => {
                res.push({
                    url: e.url,
                    size: e.formattedSize
                })
            })
            resolve(res)
        }).catch(() => {
            reject("Failed to download")
        })
    })
}