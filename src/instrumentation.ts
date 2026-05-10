export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertProductionRuntimeEnv } = await import("@/lib/env");
    assertProductionRuntimeEnv();
  }
}
