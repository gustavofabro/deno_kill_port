import { assert } from "./test_deps.ts";
import { killPort } from "./mod.ts";

Deno.test("it should kill the port process", async function (): Promise<void> {
  const listener = Deno.listen({ port: 8080 });
  await killPort(8080);

  let isAddrFree = true;

  try {
    Deno.listen({ port: 8080 });
  } catch (err) {
    if (err instanceof Deno.errors.AddrInUse) {
      isAddrFree = false;
    }
  }

  listener.close();

  assert(isAddrFree);
});
