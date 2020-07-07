interface KillPortOptions {
  protocol: "tcp" | "udp";
}

/**
 *  Finds and kills the informed port process / task
 * @param port Port number
 * @param options (optional)
 * @return Returns a promise with the port's PID or null if the port PID was not found
 *
 * Example:
 *
 *     await killPort(8082);
 *
 */
export async function killPort(
  port: number,
  options: KillPortOptions = {
    protocol: "tcp",
  },
): Promise<number | null> {
  return await (Deno.build.os == "windows"
    ? handleKillPortWindows(port, options)
    : handleKillPort(port, options));
}

async function handleKillPortWindows(
  port: number,
  options: KillPortOptions,
): Promise<number | null> {
  const pid = await getPidPortWindows(port, options);

  if (!pid) {
    return null;
  }

  await killProcessWindows(pid);

  return pid;
}

async function getPidPortWindows(
  port: number,
  options: KillPortOptions,
): Promise<number | null> {
  const cmd = Deno.run({
    cmd: ["cmd", "/c", "netstat -a -n -o | findstr", `${port}`],
    stdout: "piped",
    stderr: "piped",
  });

  const output = new TextDecoder("utf-8").decode(await cmd.output());

  if (
    (options.protocol).toUpperCase() ===
      output.trim().split(/[\s, ]+/)[0].toUpperCase()
  ) {
    return parseInt(output.trim().split(/[\s, ]+/)[4]);
  }

  return null;
}

async function killProcessWindows(pid: number): Promise<void> {
  const cmd = Deno.run({
    cmd: ["cmd", "/c", "taskkill /PID " + `${pid}` + " /F"],
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
}

async function handleKillPort(
  port: number,
  options: KillPortOptions,
): Promise<number | null> {
  const pid = await getPidPort(port, options);

  if (!pid) {
    return null;
  }

  await killProcess(pid);

  return pid;
}

async function getPidPort(
  port: number,
  options: KillPortOptions,
): Promise<number> {
  const cmd = Deno.run({
    cmd: ["fuser", `${port}/${options.protocol}`],
    stdout: "piped",
    stderr: "piped",
  });

  const output = await cmd.output();

  cmd.close();

  return parseInt((new TextDecoder().decode(output)).trim());
}

async function killProcess(pid: number): Promise<void> {
  const cmd = Deno.run({
    cmd: ["kill", "-9", `${pid}`],
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
}
