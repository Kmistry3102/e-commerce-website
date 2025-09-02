import { NextResponse } from "next/server"

export const response = (success: string ,statusCode: number, message: string, data = {}) => {
  return NextResponse.json({
    success, statusCode, message, data
  })
}