import axios from 'axios';
import FormData from 'form-data';
import { URLSearchParams } from 'url';

const baseHeaders = {
    'user-agent': 'Mozilla/5.0 (Linux; Android 9; Redmi 7A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36'
};

const getTokenAndServerInfo = (data: string) => {
    const token = /<input type="hidden" name="token" value="(.*?)" id="token">/.exec(data)?.[1];
    const build_server = /<input type="hidden" name="build_server" value="(.*?)" id="build_server">/.exec(data)?.[1];
    const build_server_id = /<input type="hidden" name="build_server_id" value="(.*?)" id="build_server_id">/.exec(data)?.[1];
    return { token, build_server, build_server_id };
};

const parseFormValue = (data: string) => {
    const form_value = /<div.*?id="form_value".+>(.*?)<\/div>/.exec(data)?.[1];
    return form_value ? JSON.parse(form_value) : null;
};

const photoOxy = async (url: string, text: string | string[]): Promise<string> => {
    try {
        const { data: getData, headers } = await axios.get(url, { headers: baseHeaders });
        const { token, build_server, build_server_id } = getTokenAndServerInfo(getData);
        const cookie = headers['set-cookie']?.[0] ?? undefined;

        const form = new FormData();
        if (typeof text === 'string') text = [text];
        text.forEach((txt) => form.append('text[]', txt));
        form.append('submit', 'GO');
        form.append('token', token);
        form.append('build_server', build_server);
        form.append('build_server_id', build_server_id);

        const { data: postData } = await axios.post(url, form, {
            headers: { ...baseHeaders, 'cookie': cookie, ...form.getHeaders() }
        });

        const formValue = parseFormValue(postData);
        if (!formValue) throw new Error('Form value not found');

        const params = new URLSearchParams(formValue);
        const { data: resultData } = await axios.get(`https://photooxy.com/effect/create-image?${params.toString()}`, {
            headers: { ...baseHeaders, 'cookie': cookie }
        });

        return build_server + resultData.image;
    } catch (error) {
        throw error;
    }
};

const photoOxyRadio = async (url: string, text: string | string[], radio: string): Promise<string> => {
    try {
        const { data: getData, headers } = await axios.get(url, { headers: baseHeaders });
        const { token, build_server, build_server_id } = getTokenAndServerInfo(getData);
        const cookie = headers['set-cookie']?.[0] ?? undefined;

        const form = new FormData();
        form.append('radio0[radio]', radio);
        if (typeof text === 'string') text = [text];
        text.forEach((txt) => form.append('text[]', txt));
        form.append('submit', 'GO');
        form.append('token', token);
        form.append('build_server', build_server);
        form.append('build_server_id', build_server_id);

        const { data: postData } = await axios.post(url, form, {
            headers: { ...baseHeaders, 'cookie': cookie, ...form.getHeaders() }
        });

        const formValue = parseFormValue(postData);
        if (!formValue) throw new Error('Form value not found');

        const params = new URLSearchParams(formValue);
        const { data: resultData } = await axios.get(`https://photooxy.com/effect/create-image?${params.toString()}`, {
            headers: { ...baseHeaders, 'cookie': cookie }
        });

        return build_server + resultData.image;
    } catch (error) {
        throw error;
    }
};

export { photoOxy, photoOxyRadio };
