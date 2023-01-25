import { Router, IRequest } from "itty-router";
import { baseRequest } from "./lib";

const app = Router();

app
  .get("/headshot/:id/:size?", async (request: IRequest, _, context: ExecutionContext) => {
    const { id, size = "150" } = request.params;


    return await baseRequest(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=${size}x${size}&format=Png&isCircular=false`, request, context
    );
  })
  .get("/badges/:id", async (request: IRequest, _, context: ExecutionContext) => {
    const { id } = request.params;

    return await baseRequest(
      `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${id}&size=150x150&format=Png&isCircular=false`, request, context
    );
  })
  .get("/developer-product/:id/:size?", async (request: IRequest, _, context: ExecutionContext) => {
    const { id, size = "150" } = request.params;

    return await baseRequest(
      `https://thumbnails.roblox.com/v1/developer-products/icons?developerProductIds=${id}&size=${size}x${size}&format=Png&isCircular=false`, request, context
    );
  })
  .get("/game-pass/:id", async (request: IRequest, _, context: ExecutionContext) => {
    const { id } = request.params;

    return await baseRequest(
      `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${id}&size=150x150&format=Png&isCircular=false`, request, context
    );
  })
  .get("/game/:id?/:size?", async (request: IRequest, _, context: ExecutionContext) => {
    const { id = "123456", size = "150" } = request.params;

    return await baseRequest(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${id}&returnPolicy=PlaceHolder&size=${size}x${size}&format=Png&isCircular=false`, request, context)
  })
  .get("/group/:id/:size?", async (request: IRequest, _, context: ExecutionContext) => {
    const { id, size = "150" } = request.params;

    return await baseRequest(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${id}&size=${size}x${size}&format=Png&isCircular=false`, request, context)
  })
  .all(
    "*",
    () =>
      new Response(
        JSON.stringify({
          message: "URL does not exist, or format is incorrect.",
        }),
        { status: 404 }
      )
  );

export default {
  fetch: app.handle,
};
