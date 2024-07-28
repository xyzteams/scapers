import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

interface Download {
    name: string;
    post: string;
    nume: string;
    type: string;
    link: string;
}

interface Data {
    title: string;
    link: string;
    downloads: Download[];
}

async function samehadaku(url: string): Promise<Data> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!/samehadaku\.email/gi.test(url)) return reject("Invalid URL!");

            const htmlResponse = await axios.get(url, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                },
            });

            const $ = cheerio.load(htmlResponse.data);
            const data: Data = {
                title: $('h1[itemprop="name"]').text().trim(),
                link: url,
                downloads: [],
            };

            const downloadPromises = $("div#server > ul > li").map(async (_i, el) => {
                const v: Download = {
                    name: $(el).find("span").text().trim(),
                    post: $(el).find("div").attr("data-post") || '',
                    nume: $(el).find("div").attr("data-nume") || '',
                    type: $(el).find("div").attr("data-type") || '',
                    link: '',
                };

                const formData = new FormData();
                formData.append("action", "player_ajax");
                formData.append("post", v.post);
                formData.append("nume", v.nume);
                formData.append("type", v.type);

                const response = await axios.post(
                    "https://samehadaku.email/wp-admin/admin-ajax.php",
                    formData,
                    {
                        headers: {
                            'User-Agent':
                                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                            'Origin': 'https://samehadaku.email',
                            ...formData.getHeaders(),
                        },
                    }
                );

                v.link = cheerio.load(response.data)("iframe").attr("src") || '';

                return v;
            }).get();

            data.downloads = await Promise.all(downloadPromises);

            resolve(data);
        } catch (e) {
            reject(e);
        }
    });
}

export default samehadaku;