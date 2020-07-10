[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/kill-port)

<h1 align="center">🦕 kill-port</h1>

<p align="center">
  Deno module that kills the process of an informed port
</p>

<p align="center">
  <a href="https://github.com/gustavofabro/deno_kill_port/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/gustavofabro/deno_kill_port" alt="Deno kill-port is under MIT license." />
  </a>
</p>


kill-port is available through:
- https://nest.land/package/kill-port
- https://deno.land/x/kill_port


## Usage

```typescript
import { killPort } from "https://x.nest.land/kill-port@1.0.1/mod.ts";

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
