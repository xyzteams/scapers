export interface AIResponse {
    data: any;
}

export interface AnimagineOptions {
    prompt?: string;
    negative?: string;
    style?: "none" | "Cinematic" | "Photographic" | "Anime" | "Manga" | "Digital Art" | "Pixel art" | "Fantasy art" | "Neonpunk" | "3D Model";
    sampler?: "DDIM" | "Euler a" | "Euler" | "DPM++ 2M Karras" | "DPM++ 2M SDE Karras" | "DPM++ SDE Karras";
    quality?: "none" | "Light" | "Standard" | "Heavy";
    width?: number;
    height?: number;
    ratio?: "Custom" | "640 x 1536" | "832 x 1216" | "1024 x 1024" | "1152 x 896" | "1344 x 768" | "768 x 1344" | "896 x 1152" | "1216 x 832" | "1536 x 640";
}

export interface ChatMessage {
    role: string;
    content: string;
}

export interface VoiceCompletionOptions {
    stream: any;
    prompt: string;
    temperature?: number;
    language?: string;
    response_format?: string;
}

export interface DriveData {
    name: string | undefined;
    download: string;
    link: string;
}

export interface IGDLResult {
    status: boolean;
    media?: string[];
    message?: string;
}

export interface IGStoryResult {
    author: string;
    thumb: string;
    url: string;
}

export interface MediafireData {
    name: string;
    filename: string | undefined;
    type: string;
    size: string;
    created: Date;
    descHeader: string;
    desc: string;
    media: string | undefined;
    link: string;
}

export interface PindlDownload {
    quality: string;
    format: string;
    link: string;
}

export interface PindlResult {
    title: string;
    thumbnail: string | undefined;
    download: PindlDownload[];
}

export interface samehadakuDownload {
    name: string;
    post: string;
    nume: string;
    type: string;
    link: string;
}

export interface samehadakuData {
    title: string;
    link: string;
    downloads: samehadakuDownload[];
}

export interface SnackVideoResult {
    creator: string;
    url: string | undefined;
    thumb: string | undefined;
}

export interface SnackVideoData {
    title: string;
    thumbnail: string | undefined;
    media: string | undefined;
    author: string;
    authorImage: string | undefined;
    like: string;
    comment: string;
    share: string;
}

export interface SpotifyMetadata {
    createdDate: string;
    title: string;
    type: string;
    thumbnail: string;
    artist: string;
    duration: {
        duration: string;
        time: string;
    };
}

export interface SpotifyResponse {
    creator: string;
    buffer: Buffer;
    metadata: SpotifyMetadata;
}

export interface TeraboxResponse {
    status: boolean;
    data?: any;
    message?: string;
}

export interface ThreadsResponse {
    media: {
        url: string;
        type: string;
        [key: string]: any;
    };
}

export interface TikTokDLResult {
    creator?: string;
    status: boolean;
    caption?: string;
    url?: string;
    audio?: string;
    message?: any;
}

export interface TwitterMedia {
    desc: string;
    thumb: string | undefined;
    video_sd: string | undefined;
    video_hd: string | undefined;
    audio: string | undefined;
}

export interface DownloadResponse {
    [key: string]: any;
}

export interface VideoDetails {
    title: string;
    url: string;
    thumbnail: string;
    duration: {
        seconds: number;
        timestamp: string;
    };
    views: number;
    publish: string;
}

export interface IgStalkResult {
    username: string;
    full_name: string;
    profile_pic_url_hd: string;
    biography: string;
    followers_count: number;
    following_count: number;
    is_private: boolean;
}

export interface StickerData {
    total_get: string;
    page: number;
    stickers: {
        [key: string]: string;
    }[];
}

export interface TikTokVideo {
    title: string;
    cover: string;
    origin_cover: string;
    link: string;
    no_watermark: string;
    watermark: string;
    music: any;
    views: number;
    like: number;
    comment: number | null;
    share: number;
    download: number | null;
    save: number | null;
    create_time: number;
}

export interface KhodamResult {
    nama: string;
    khodam: string;
    share: string;
}

export interface GempaResult {
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

export interface NGLResponse {
    creator: string;
    response: any;
}

export interface Quote {
    number: number;
    author: string;
    bio: string;
    quote: string;
}

export interface QuoteResponse {
    status: boolean;
    data?: Quote[];
}

export interface QuoteAnime {
    link: string;
    gambar: string;
    karakter: string;
    anime: string;
    episode: string;
    up_at: string;
    quotes: string;
}

export interface ServerData {
    ip: string;
    port: number;
    versi: string;
    player: string;
}

export interface StyledText {
    author: string;
    text: string;
}

export interface SearchResultYT {
    judul: string;
    desc: string;
    thumb: string;
    link: string;
}

export interface EffectResult {
    judul: string;
    desc: string;
    exam: string;
    inputs: { input: string }[];
}

export interface ErrorResult {
    error: string;
}

export interface QuoteMessage {
    entities: any[];
    avatar: boolean;
    from: {
        id: number;
        name: string;
        photo: {
            url: string;
        };
    };
    text: string;
    replyMessage: object;
}

export interface QuoteRequest {
    type: string;
    format: string;
    backgroundColor: string;
    width: number;
    height: number;
    scale: number;
    messages: QuoteMessage[];
}