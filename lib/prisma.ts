// @ts-nocheck
/* eslint-disable vars-on-top */
/* eslint-disable import/prefer-default-export */
import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
