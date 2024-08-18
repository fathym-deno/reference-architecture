import type { Status } from "../common/status.ts";

/**
 * The base response object for API requests.
 */
export type BaseResponse = Record<string | number | symbol, unknown> & {
  /** The status of the response. */
  Status: Status;
};

/**
 * The base response object for API requests including a model.
 */
export type BaseResponseModel<TModel> = BaseResponse & {
  /** The model for the response. */
  Model: TModel;
};
