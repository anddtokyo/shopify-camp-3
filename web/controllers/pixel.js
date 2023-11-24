import PixelService from "../services/pixel.js";

export const createPixel = async (_req, res) => {
  const pixelService = new PixelService(res.locals.shopify.session);
  await pixelService.createPixel();
  res.status(200);
};
