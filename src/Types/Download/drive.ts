import axios from "axios";
import cheerio from "cheerio";

interface DriveData {
    name: string | undefined;
    download: string;
    link: string;
}

export default async function drive(url: string): Promise<DriveData> {
    try {
        if (!/drive\.google\.com\/file\/d\//gi.test(url)) {
            throw new Error("Invalid URL");
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const id = url.split("/")[5];
        const data: DriveData = {
            name: $("head").find("title").text()?.split("-")[0]?.trim() ?? "",
            download: `https://drive.google.com/uc?id=${id}&export=download`,
            link: url,
        };

        return data;
    } catch (error) {
        throw error;
    }
}