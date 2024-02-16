import { STATUS_CODE } from "../src.deps.ts";

export function redirectRequest(location: string, status: number): Response;

export function redirectRequest(
  location: string,
  preserve?: boolean,
  permanent?: boolean,
): Response;

export function redirectRequest(
  location: string,
  statusPreserve?: number | boolean,
  permanent?: boolean,
): Response {
  let status: number;

  if (typeof statusPreserve === "number") {
    status = statusPreserve;
  } else {
    if (statusPreserve) {
      status = permanent
        ? STATUS_CODE.PermanentRedirect
        : STATUS_CODE.TemporaryRedirect;
    } else {
      status = permanent ? STATUS_CODE.MovedPermanently : STATUS_CODE.Found;
    }
  }

  const headers = new Headers();

  headers.set("location", location);

  return respond(null, {
    status: status,
    headers,
  });
}

export function respond(
  body: string | Record<string, unknown> | unknown[] | null,
  init?: ResponseInit,
) {
  if (body && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  return new Response(body, {
    ...{ status: STATUS_CODE.OK },
    ...(init || {}),
  });
}
