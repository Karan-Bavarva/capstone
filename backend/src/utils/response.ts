import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

export const sendResponse = <T>(
  res: Response,
  message: string,
  status: true | false,
  data: T | [],
  pagination: PaginationMeta | null = null
) => {
  return res.status(200).json({
    meta: { status, message, pagination },
    data,
  });
};

export const success = <T>(
  res: Response,
  message: string,
  data: T,
  pagination: PaginationMeta | null = null
) => sendResponse(res, message, true, data, pagination);

export const failure = (
  res: Response,
  message: string,
  data: any = []
) => sendResponse(res, message, false, data);
