import axios from 'axios';
import cheerio from 'cheerio';

interface StyledText {
    author: string;
    text: string;
}

export default function styleText(text: string): Promise<StyledText[]> {
    return axios.get(`http://qaz.wtf/u/convert.cgi?text=${text}`)
        .then(({ data }) => {
            const $ = cheerio.load(data);
            const result: StyledText[] = [];
            $('table > tbody > tr').each((_, element) => {
                result.push({
                    author: 'XYZ TEAMS',
                    text: $(element).find('td:nth-child(2)').text().trim()
                });
            });
            return result;
        });
}
