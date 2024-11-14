export async function generateDirectoryHash(dir: string): Promise<string> {
  const encoder = new TextEncoder();
  const fileContents: Uint8Array[] = [];

  async function hashDirectory(directory: string) {
    for await (const entry of Deno.readDir(directory)) {
      const filePath = `${directory}/${entry.name}`;

      if (entry.isDirectory) {
        await hashDirectory(filePath); // Recursive for subdirectories
      } else if (entry.isFile) {
        const content = await Deno.readFile(filePath);
        fileContents.push(content); // Collect all file contents
      }
    }
  }

  await hashDirectory(dir);

  // Concatenate all file contents into one Uint8Array for hashing
  const concatenatedContents = encoder.encode(
    fileContents.map((content) => new TextDecoder().decode(content)).join(""),
  );

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    concatenatedContents,
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(""); // Convert to hex string
}
