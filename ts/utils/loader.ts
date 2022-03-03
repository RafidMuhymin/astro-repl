/* Inspired by https://github.com/okikio/bundle/blob/main/src/ts/util/loader.ts */
import { isAbsolute, extname } from './path';

export const isBareImport = (url: string) => {
    return /^(?!\.).*/.test(url) && !isAbsolute(url);
}

// Based on https://github.com/egoist/play-esbuild/blob/main/src/lib/esbuild.ts
export const RESOLVE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];
export const inferLoader = (url: string) => {
    const ext = extname(url);
    if (RESOLVE_EXTENSIONS.includes(ext))
        return ext.slice(1);

    if (ext === ".mjs" || ext === ".cjs") return "js";
    if (ext === ".mts" || ext === ".cts") return "ts";

    if (ext == ".scss") return "css";

    if (ext == ".png" || ext == ".jpeg" || ext == ".ttf") return "dataurl";
    if (ext == ".svg" || ext == ".html" || ext == ".txt") return "text";
    if (ext == ".wasm") return "file";

    return ext.length ? "text" : "ts";
}

export const HOST = 'https://unpkg.com';
export const getCDNHost = (url: string, host = HOST) => {
    let argPath = url.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:/, "");
    if (/^skypack\:/.test(url)) {
        host = `https://cdn.skypack.dev`;
    } else if (/^(esm\.sh|esm)\:/.test(url)) {
        host = `https://cdn.esm.sh`;
    } else if (/^unpkg\:/.test(url)) {
        host = `https://unpkg.com`;
    } else if (/^(jsdelivr|esm\.run)\:/.test(url)) {
        host = `https://cdn.jsdelivr.net/npm`;
    }

    // typescript will only work on esm.sh
    else if (/^typescript/.test(url)) {
        host = `https://unpkg.com`;
    }

    host = /\/$/.test(host) ? host : `${host}/`;
    return { argPath, host, url: host + argPath.replace(/^\//, "") };
}