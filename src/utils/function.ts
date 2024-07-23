import axios from "axios";

export function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function getMimeType(url: string) {
    return axios.head(url).then(res => res.headers["content-type"]);
}

export function pickRandom(list: any[]) {
    return list[Math.floor(Math.random() * list.length)]
}

export function fetchJson(url: string) {
    return axios.get(url).then(res => res.data);
}