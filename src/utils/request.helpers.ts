export function redirectRequest(location: string, status = 303) {
  const headers = new Headers();

  headers.set("location", location);

  return new Response(null, {
    status: status,
    headers,
  });
}
