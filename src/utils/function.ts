import axios from "axios";

export function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function getMimeType(url: string) {
    return axios.head(url).then(res => res.headers["content-type"]);
}