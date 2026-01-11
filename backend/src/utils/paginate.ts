import { Model } from "mongoose";

interface PaginateProps {
  model: Model<any>;
  page?: number;
  limit?: number;
  filter?: any;
  sort?: any;
  populate?: any;
}

export const paginate = async ({
  model,
  page = 1,
  limit = 10,
  filter = {},
  sort = { createdAt: -1 },
  populate = null,
}: PaginateProps) => {
  const skip = (page - 1) * limit;

  let query = model.find(filter).skip(skip).limit(limit).sort(sort);

  if (populate) {
    query = query.populate(populate);
  }

  const [records, totalRecords] = await Promise.all([
    query,
    model.countDocuments(filter),
  ]);

  return {
    data: records,  // <-- return only records here
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    },
  };
};
