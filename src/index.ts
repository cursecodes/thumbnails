import { Router } from "itty-router";
const app = Router();

function base64Encode(buf: ArrayBuffer): string {
  let string = "";
  new Uint8Array(buf).forEach((byte) => {
    string += String.fromCharCode(byte);
  });
  return btoa(string);
}

function base64Decode(string: string): ArrayBuffer {
  string = atob(string);
  const length = string.length,
    buf = new ArrayBuffer(length),
    bufView = new Uint8Array(buf);
  for (var i = 0; i < length; i++) {
    bufView[i] = string.charCodeAt(i);
  }
  return buf;
}

async function baseRequest(url) {
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
    headers: { "Content-Type": "image/png" },
  });
}

interface ThumbnailResponse {
  data: unknown
}

app.get("/headshot/:id/:size", async ({ params }) => {
  const { id = 1, size = "352" } = params;

  return await baseRequest(
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=${size}x${size}&format=Png&isCircular=false`
  );
});

app.all(
  "*",
  () => new Response(JSON.stringify({ message: "URL does not exist, or format is incorrect." }), { status: 404 })
);

export default {
  fetch: app.handle
}