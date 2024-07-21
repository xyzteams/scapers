import axios from 'axios';
import cheerio from 'cheerio';

interface ServerData {
    ip: string;
    port: number;
    versi: string;
    player: string;
}

export default function servermc(): Promise<ServerData[]> {
    return new Promise((resolve, reject) => {
        axios.get('https://minecraftpocket-servers.com/country/indonesia/')
            .then(response => {
                const $ = cheerio.load(response.data);
                const hasil: ServerData[] = [];

                $('tr').each((_, element) => {
                    const ip = $(element).find('button.btn.btn-secondary.btn-sm').eq(1).text().trim().split(':').shift();
                    const port = parseInt($(element).find('button.btn.btn-secondary.btn-sm').eq(1).text().trim().split(':').pop() || '0', 10);
                    const versi = $(element).find('a.btn.btn-info.btn-sm').text();
                    const player = $(element).find('td.d-none.d-md-table-cell > strong').eq(1).text().trim();

                    if (ip) { // Ensure ip is not empty
                        const data: ServerData = {
                            ip,
                            port,
                            versi,
                            player,
                        };
                        hasil.push(data);
                    }
                });

                resolve(hasil);
            })
            .catch(reject);
    });
}
