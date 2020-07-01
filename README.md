# 🦕 deno-kill-port

[Deno](https://deno.land) module that kills the process of an informed port.

## Usage

```typescript
import { killPort } from "https://deno.land/x/kill_port/mod.ts";

await killPort(8082);
```

## Test

```bash
deno test --allow-run --allow-net
```

## Format code

```bash
deno fmt **/*.ts
```

## Resources

- [Deno Website](https://deno.land)
- [Deno Style Guide](https://deno.land/std/style_guide.md)
- [Deno Gitter](https://gitter.im/denolife/Lobby)
