import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import {
  AddToCartBody,
  UpdateCartItemBody,
  UpdateCartItemParams,
  RemoveFromCartParams,
  GetCartResponse,
  AddToCartResponse,
  UpdateCartItemResponse,
  RemoveFromCartResponse,
  ClearCartResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getSessionId(req: import("express").Request): string {
  const cookieSessionId = req.cookies?.["session_id"];
  if (cookieSessionId) return cookieSessionId;
  return "default-session";
}

async function buildCartResponse(sessionId: string) {
  const rows = await db
    .select({
      cartItem: cartItemsTable,
      product: productsTable,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  const items = rows.map((row) => ({
    productId: row.cartItem.productId,
    quantity: row.cartItem.quantity,
    product: row.product,
  }));

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return {
    items,
    totalItems,
    subtotal: Math.round(subtotal * 100) / 100,
    sessionId,
  };
}

router.get("/cart", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  const cart = await buildCartResponse(sessionId);
  res.json(GetCartResponse.parse(cart));
});

router.post("/cart", async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const sessionId = getSessionId(req);
  const { productId, quantity } = parsed.data;

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.sessionId, sessionId),
        eq(cartItemsTable.productId, productId),
      ),
    );

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({ sessionId, productId, quantity });
  }

  const cart = await buildCartResponse(sessionId);
  res.json(AddToCartResponse.parse(cart));
});

router.put("/cart/:productId", async (req, res): Promise<void> => {
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const sessionId = getSessionId(req);
  const { productId } = params.data;
  const { quantity } = parsed.data;

  if (quantity <= 0) {
    await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.sessionId, sessionId),
          eq(cartItemsTable.productId, productId),
        ),
      );
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(
        and(
          eq(cartItemsTable.sessionId, sessionId),
          eq(cartItemsTable.productId, productId),
        ),
      );
  }

  const cart = await buildCartResponse(sessionId);
  res.json(UpdateCartItemResponse.parse(cart));
});

router.delete("/cart/clear", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  await db
    .delete(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, sessionId));

  const cart = await buildCartResponse(sessionId);
  res.json(ClearCartResponse.parse(cart));
});

router.delete("/cart/:productId", async (req, res): Promise<void> => {
  const params = RemoveFromCartParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const sessionId = getSessionId(req);
  const { productId } = params.data;

  await db
    .delete(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.sessionId, sessionId),
        eq(cartItemsTable.productId, productId),
      ),
    );

  const cart = await buildCartResponse(sessionId);
  res.json(RemoveFromCartResponse.parse(cart));
});

export default router;
