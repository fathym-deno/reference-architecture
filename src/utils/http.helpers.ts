export function redirectRequest(location: string, status = 303) {
  const headers = new Headers();

  headers.set('location', location);

  return new Response(null, {
    status: status,
    headers,
  });
}

export function respond(
  body: string | Record<string, unknown>,
  init: RequestInit | undefined
) {
  if (typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  return new Response(body, {
    ...init,
  });
}
