import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { sleep } from "../../Utils/functions.js";

export default async function removebg(path: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!path) reject("Required Path Or Url");

            if (path.match(/^https?:\/\//)) {
                const imageBuffer = await axios.get(path, { responseType: "arraybuffer" }).then((r) => r.data);
                fs.writeFileSync("images.png", imageBuffer);
                path = "images.png";
            }

            const host = await axios.get("https://www.onlineconverter.com/get/host", {
                headers: {
                    authority: "www.onlineconverter.com",
                    accept: "/",
                    "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
                    referer: "https://www.onlineconverter.com/remove-image-background",
                    "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": '"Android"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                },
            });

            const url = host.data;
            const buffer = fs.readFileSync(path);
            const ext = path.split('.').pop();
            const form = new FormData();
            form.append("file", buffer, {
                filename: `${Date.now()}.${ext}`,
            });
            form.append("select", "1");
            form.append("class", "tool");
            form.append("from", "image");
            form.append("to", "remove-image-background");
            form.append("source", "online");

            const upload = await axios.post(url, form, {
                headers: {
                    ...form.getHeaders(),
                    authority: url,
                    accept: "/",
                    "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7,id;q=0.6",
                    origin: "https://www.onlineconverter.com",
                    referer: "https://www.onlineconverter.com/",
                    "sec-ch-ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": '"Android"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                },
            });

            const result = upload.data;
            const id = result.match(/(?:convert\/)(\w+)/)[1];
            const res = `${url.split("/send").join("")}/${id}`;
            fs.unlinkSync(path);
            sleep(2000)
            resolve(res + "/download");
        } catch (error) {
            reject(error);
        }
    });
}