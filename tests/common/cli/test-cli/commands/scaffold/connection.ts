export const Metadata = {
  Name: "dev",
  Description: "Run dev mode",
  Usage: "oi dev",
};

export default class ConnectionCommand {
  constructor(public Flags: Record<string, unknown>, public Args: string[]) {}

  async Run() {
    console.log("🔧 Scaffolding connection...");
  }
}
