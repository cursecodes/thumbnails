import { ExecutionContext } from "@cloudflare/workers-types";
import { IRequest } from "itty-router";

export function base64Encode(buf: ArrayBuffer): string {
    let string = "";
    new Uint8Array(buf).forEach((byte) => {
        string += String.fromCharCode(byte);
    });
    return btoa(string);
}

export function base64Decode(string: string): ArrayBuffer {
    string = atob(string);
    const length = string.length,
        buf = new ArrayBuffer(length),
        bufView = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        bufView[i] = string.charCodeAt(i);
    }
    return buf;
}

export async function baseRequest(url: string, request: IRequest, context: ExecutionContext): Promise<Response> {
    

    const cache = caches.default

    const cachedResponse = await cache.match(request.url)

    if (cachedResponse) {
        console.log("CACHE HIT")

        return new Response(cachedResponse.body, cachedResponse)
    }

    console.log("CACHE MISS")
    
    const thumbnail = await fetch(url);

    const json: ThumbnailResponse = await thumbnail.json();

    if (!thumbnail.ok) {
        if (json.data && !json.data.length) {
            return new Response(
                JSON.stringify({
                    message: "User does not exist.",
                    url,

                }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({
                message: json.errors?.[0].message,
                url,
                robloxStatusCode: thumbnail.status,

            }),
            { status: 400 }
        );
    }


    const image = await fetch(json.data?.[0].imageUrl);

    const text = base64Encode(await image.arrayBuffer());
    const bin = base64Decode(text);

    const response = new Response(bin, {
        headers: { "Content-Type": "image/png", "cache-control": "public, s-maxage=14400" },
    });

    context.waitUntil(cache.put(request.url, response.clone()))

    return response
}

export interface ThumbnailResponse {
    data?: Array<ThumbnailData>
    errors?: Array<ThumbnailError>
}

export interface ThumbnailData {
    targetId: number
    state: string
    imageUrl: string
}

export interface ThumbnailError {
    code: number
    message: string
    userFacingMessage: string
    field: string
}