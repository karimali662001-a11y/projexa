import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  InsertVisitor,
  visitors,
  products,
  orders,
  payments,
  emailNotifications,
  orderItems,
  InsertOrder,
  InsertPayment,
  InsertEmailNotification,
  InsertOrderItem,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Visitor tracking helpers
 */
export async function logVisitor(data: InsertVisitor) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(visitors).values(data);
  } catch (error) {
    console.error("[Database] Failed to log visitor:", error);
  }
}

export async function getVisitorStats(days: number = 7) {
  const db = await getDb();
  if (!db) return [];
  try {
    const result = await db.select().from(visitors);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get visitor stats:", error);
    return [];
  }
}

/**
 * Product helpers
 */
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(products);
  } catch (error) {
    console.error("[Database] Failed to get products:", error);
    return [];
  }
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get product:", error);
    return null;
  }
}

/**
 * Order helpers
 */
export async function createOrder(orderData: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(orders).values(orderData);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get order:", error);
    return null;
  }
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update order status:", error);
    return false;
  }
}

/**
 * Order items helpers
 */
export async function addOrderItem(itemData: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(orderItems).values(itemData);
  } catch (error) {
    console.error("[Database] Failed to add order item:", error);
    throw error;
  }
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  } catch (error) {
    console.error("[Database] Failed to get order items:", error);
    return [];
  }
}

/**
 * Payment helpers
 */
export async function createPayment(paymentData: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(payments).values(paymentData);
  } catch (error) {
    console.error("[Database] Failed to create payment:", error);
    throw error;
  }
}

export async function getPaymentByReference(reference: string) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db
      .select()
      .from(payments)
      .where(eq(payments.reference, reference))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get payment:", error);
    return null;
  }
}

export async function updatePaymentStatus(paymentId: number, status: string) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db
      .update(payments)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(payments.id, paymentId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update payment status:", error);
    return false;
  }
}

/**
 * Email notification helpers
 */
export async function logEmailNotification(data: InsertEmailNotification) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(emailNotifications).values(data);
  } catch (error) {
    console.error("[Database] Failed to log email notification:", error);
  }
}

export async function getPendingEmailNotifications() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(emailNotifications)
      .where(eq(emailNotifications.status, "pending"));
  } catch (error) {
    console.error("[Database] Failed to get pending emails:", error);
    return [];
  }
}

export async function updateEmailNotificationStatus(
  id: number,
  status: "sent" | "failed",
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db
      .update(emailNotifications)
      .set({
        status,
        errorMessage: errorMessage || null,
        sentAt: status === "sent" ? new Date() : null,
      })
      .where(eq(emailNotifications.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update email notification:", error);
    return false;
  }
}
