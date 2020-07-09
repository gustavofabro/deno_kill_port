<h1 align="center">🦕 deno-kill-port</h1>

<p align="center">
  Deno module that kills the process of an informed port
</p>

<p align="center">
  <a href="https://github.com/gustavofabro/deno_kill_port/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/gustavofabro/deno_kill_port" alt="Deno kill-port is under MIT license." />
  </a>
</p>

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
- [Deno Style Guide](https://deno.land/manual/contributing/style_guide)
- [Deno Gitter](https://gitter.im/denolife/Lobby)
