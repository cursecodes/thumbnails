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

export async function baseRequest(url) {
    const thumbnail = await fetch(url);

    if (!thumbnail.ok) {
        return new Response(
            JSON.stringify({
                message: "Thumbnail probably does not exist",
                url,
                robloxStatusCode: thumbnail.status,
            }),
            { status: 400 }
        );
    }

    const json: ThumbnailResponse = await thumbnail.json();

    const image = await fetch(json.data?.[0].imageUrl);

    const text = base64Encode(await image.arrayBuffer());
    const bin = base64Decode(text);

    return new Response(bin, {
        headers: { "Content-Type": "image/png", "Cache-Control": "s-maxage=43200" },
    });
}

export interface ThumbnailResponse {
    data: unknown
}