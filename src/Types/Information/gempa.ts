import axios from 'axios';
import cheerio from 'cheerio';

interface GempaResult {
    status: boolean;
    code: number;
    result: {
        Waktu: string;
        Lintang: string;
        Bujur: string;
        Magnitudo: string;
        Kedalaman: string;
        Wilayah: string;
        Map: string | undefined;
    };
}

export default async function Gempa(): Promise<GempaResult> {
    try {
        const response = await axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg');
        const $ = cheerio.load(response.data);
        const urlElems = $('table.table-hover.table-striped');

        for (let i = 0; i < urlElems.length; i++) {
            const urlSpan = $(urlElems[i]).find('tbody')[0];

            if (urlSpan) {
                const urlData = $(urlSpan).find('tr')[0];
                const Kapan = $(urlData).find('td')[1];
                const Letak = $(urlData).find('td')[2];
                const Magnitudo = $(urlData).find('td')[3];
                const Kedalaman = $(urlData).find('td')[4];
                const Wilayah = $(urlData).find('td')[5];
                const lintang = $(Letak).text().split(' ')[0];
                const bujur = $(Letak).text().split(' ')[2];
                const hasil: GempaResult = {
                    status: true,
                    code: 200,
                    result: {
                        Waktu: $(Kapan).text(),
                        Lintang: lintang ?? '',
                        Bujur: bujur ?? '',
                        Magnitudo: $(Magnitudo).text(),
                        Kedalaman: $(Kedalaman).text().replace(/\t/g, '').replace(/I/g, ''),
                        Wilayah: $(Wilayah).text().replace(/\t/g, '').replace(/I/g, '').replace('-', '').replace(/\r/g, '').split('\n')[0] ?? '',
                        Map: $('div.row > div > img').attr('src')
                    }
                };
                return hasil;
            }
        }
        throw new Error('No data found');
    } catch (err) {
        throw new Error(`Error: ${err}`);
    }
}