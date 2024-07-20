import axios from 'axios';

export default function ssweb(url: string, device: string): Promise<Buffer> {
    const baseURL = 'https://www.screenshotmachine.com';
    const params = new URLSearchParams({ url, device, cacheLimit: '0' });

    return axios.post(`${baseURL}/capture.php`, params, {
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).then(response => {
        if (response.data.status === 'success') {
            const link = response.data.link;
            const cookies = response.headers['set-cookie']?.join('') || '';

            return axios.get(`${baseURL}/${link}`, {
                headers: { cookie: cookies },
                responseType: 'arraybuffer'
            }).then(res => res.data);
        } else {
            throw new Error('ScreenshotMachine request failed.');
        }
    }).catch(error => {
        throw error;
    });
}
