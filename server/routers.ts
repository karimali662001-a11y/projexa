import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  logVisitor,
  getVisitorStats,
  getAllProducts,
  getProductById,
  createOrder,
  addOrderItem,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  visitors: router({
    track: publicProcedure
      .input(
        z.object({
          userAgent: z.string().optional(),
          page: z.string(),
          referrer: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await logVisitor({
          ipAddress: "0.0.0.0",
          userAgent: input.userAgent,
          page: input.page,
          referrer: input.referrer,
        });
        return { success: true };
      }),
    stats: publicProcedure.query(async () => {
      return await getVisitorStats(7);
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getProductById(input);
    }),
  }),

  orders: router({
    create: publicProcedure
      .input(
        z.object({
          customerEmail: z.string().email(),
          customerName: z.string(),
          customerPhone: z.string(),
          totalAmount: z.number(),
          paymentMethod: z.enum(["vodafone_cash", "instapay", "manual"]),
          shippingAddress: z.string(),
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.number(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const paymentRef = nanoid();

        const order = await createOrder({
          customerEmail: input.customerEmail,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          totalAmount: input.totalAmount,
          paymentMethod: input.paymentMethod,
          paymentStatus: "pending",
          shippingAddress: input.shippingAddress,
          paymentReference: paymentRef,
        });

        const orderId = (order as any).insertId || 1;

        for (const item of input.items) {
          await addOrderItem({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          });
        }

        return { orderId, paymentReference: paymentRef };
      }),

    list: protectedProcedure.query(async () => {
      return await getAllOrders();
    }),

    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getOrderById(input);
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await updateOrderStatus(input.orderId, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
