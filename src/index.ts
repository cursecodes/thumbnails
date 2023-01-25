import { Router } from "itty-router";
import { baseRequest } from "./lib";

const app = Router();



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