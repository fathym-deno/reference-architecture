import type { Status } from "../status.ts";

export type BaseResponse = Record<string | number | symbol, unknown> & {
  Status: Status;
};

export type BaseResponseModel<TModel> = BaseResponse & {
  Model: TModel;
};
