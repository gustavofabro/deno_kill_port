interface KillPortOptions {
  protocol?: "tcp" | "udp";
}

/**
 *  Finds and kills the informed port process / task
 * @param port Port number
 * @param options (optional)
 * @return Returns a promise with the port's PID
 * Example:
 *
 *     killPort(8082);
 */
export async function killPort(
  port: number,
  options: KillPortOptions = {},
): Promise<number> {
  return await (Deno.build.os == "windows"
    ? handleKillPortWindows(port)
    : handleKillPort(port, options));
}

async function handleKillPortWindows(port: number): Promise<number> {
  const pid = await getPidPortWindows(port);

  if (!pid) {
    throw Error(`No PID found for the port "${port}"`);
  }

  await killProcessWindows(pid);

  return pid;
}

async function getPidPortWindows(port: number): Promise<number> {
  const cmd = Deno.run({
    cmd: ["cmd", "/c", "netstat -a -n -o | findstr", `${port}`],
    stdout: "piped",
    stderr: "piped",
  });
  const output = new TextDecoder("utf-8").decode(await cmd.output());
  return parseInt(output.trim().split(/[\s, ]+/)[4]);
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
  options: KillPortOptions = {},
): Promise<number> {
  const pid = await getPidPort(port, options);

  if (!pid) {
    throw Error(`No PID found for the port "${port}"`);
  }

  await killProcess(pid);

  return pid;
}

async function getPidPort(
  port: number,
  options: KillPortOptions = {},
): Promise<number> {
  const cmd = Deno.run({
    cmd: ["fuser", `${port}/${options.protocol || "tcp"}`],
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
