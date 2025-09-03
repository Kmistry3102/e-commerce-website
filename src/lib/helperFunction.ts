// src/lib/helperFunction.ts
import { NextResponse } from "next/server";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

export const response = <T extends JsonValue | undefined = undefined>(
  success: boolean,
  statusCode: number,
  message: string,
  data?: T
) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      ...(data !== undefined ? { data } : {}),
    },
    { status: statusCode }
  );
};

export const catchError = (err: unknown, customMessage?: string) => {
  // normalize error object
  const error = (typeof err === "object" && err !== null ? err : {}) as {
    code?: number | string;
    status?: number;
    statusCode?: number;
    message?: string;
    keyPattern?: Record<string, unknown>;
    stack?: string;
  };

  // Mongo duplicate key error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern ?? {}).join(", ");
    error.message = `Duplicate field: ${keys}. These field values must be unique.`;
  }

  // choose an HTTP status
  const statusCode =
    typeof error.status === "number"
      ? error.status
      : typeof error.statusCode === "number"
      ? error.statusCode
      : 500;

  // decide response body by env
  const isDev = process.env.NODE_ENV !== "production";
  const message = isDev
    ? error.message || "Internal Server Error."
    : customMessage || "Internal Server Error.";

  // put extra debug only in dev
  const data = isDev
    ? {
        error: {
          message: error.message ?? null,
          code: typeof error.code === "number" ? error.code : null,
          stack: error.stack ?? null,
        },
      }
    : undefined;

  // return unified JSON
  return response(false, statusCode, message, data);
};
