import { startOfDay, endOfDay, parseISO } from "date-fns";
import { ProductService } from "../services/product.js";

export const getProducts = async (req, res) => {
  const { startDate, endDate } = req.query;

  const createdAtMin = startOfDay(parseISO(startDate));
  const createdAtMax = endOfDay(parseISO(endDate));

  const productService = new ProductService(res.locals.shopify.session);

  const productsInDateRange = await productService.getProducts(
    createdAtMin.toISOString(),
    createdAtMax.toISOString()
  );

  console.log({ productsInDateRange });

  res.status(200).send({ products: productsInDateRange });
};
