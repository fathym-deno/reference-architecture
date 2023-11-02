export function redirectRequest(location: string, status = 303) {
  const headers = new Headers();

  headers.set('location', location);

  return respond(null, {
    status: status,
    headers,
  });
}

export function respond(
  body: string | Record<string, unknown> | null,
  init?: ResponseInit
) {
  if (body && typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  return new Response(body, {
    ...init,
  });
}
