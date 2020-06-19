import { assert } from "./test_deps.ts";
import { killPort } from "./mod.ts";

Deno.test({
  name: "it should kill the port process",
  ignore: true,
  fn: async function (): Promise<void> {
    const listener = Deno.listen({ port: 9999 });
    await killPort(9999);

    let isAddrFree = true;

    try {
      Deno.listen({ port: 9999 });
    } catch (err) {
      if (err instanceof Deno.errors.AddrInUse) {
        isAddrFree = false;
      }
    }

    listener.close();

    assert(isAddrFree);
  },
});
