# `🏞️ thumbnails `

Thumbnails is a basic Cloudflare Workers setup to act as the old `api.roblox.com` thumbnail API that only needed one request to get the image.

I chose Cloudflare Workers because of their edge locations, overall speed, and affordability.

More routes will be added soon, but today you can start using it to get by deploying it with `npx wrangler publish ./src/index.ts` and then headshots are at `https://your.deployment.workers.dev/headshot/USER_ID/SIZE`, where `USER_ID` is the User ID and `SIZE` is one of the acceptable sizes for headshots (48x48, 50x50, 60x60, 75x75, 100x100, 110x110, 150x150, 180x180, 352x352, 420x420, 720x720).