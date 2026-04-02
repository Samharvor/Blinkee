import { Router, type IRouter } from "express";
import { eq, ilike, gte, lte, and, sql } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  GetProductParams,
  GetProductResponse,
  ListProductsResponse,
  GetFeaturedProductsResponse,
  ListCategoriesResponse,
  GetStoreStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, search, minPrice, maxPrice, inStock } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(productsTable.category, category));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (minPrice != null) conditions.push(gte(productsTable.price, minPrice));
  if (maxPrice != null) conditions.push(lte(productsTable.price, maxPrice));
  if (inStock === true) conditions.push(gte(productsTable.stock, 1));

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(productsTable.name);

  res.json(ListProductsResponse.parse(products));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .orderBy(productsTable.reviewCount);

  res.json(GetFeaturedProductsResponse.parse(products));
});

router.get("/products/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      name: productsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(productsTable)
    .groupBy(productsTable.category)
    .orderBy(productsTable.category);

  const categories = rows.map((row) => ({
    name: row.name,
    count: row.count,
    slug: row.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  res.json(ListCategoriesResponse.parse(categories));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(product));
});

router.get("/store/stats", async (_req, res): Promise<void> => {
  const [stats] = await db
    .select({
      totalProducts: sql<number>`count(*)::int`,
      featuredCount: sql<number>`sum(case when ${productsTable.isFeatured} = true then 1 else 0 end)::int`,
      averageRating: sql<number>`avg(${productsTable.rating})::float`,
    })
    .from(productsTable);

  const [catCount] = await db
    .select({
      totalCategories: sql<number>`count(distinct ${productsTable.category})::int`,
    })
    .from(productsTable);

  res.json(
    GetStoreStatsResponse.parse({
      totalProducts: stats?.totalProducts ?? 0,
      totalCategories: catCount?.totalCategories ?? 0,
      featuredCount: stats?.featuredCount ?? 0,
      averageRating: stats?.averageRating ?? 0,
    }),
  );
});

export default router;
