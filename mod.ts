interface KillPortOptions {
  protocol?: "tcp" | "udp";
}

export async function killPort(
  port: number,
  options: KillPortOptions = {},
): Promise<void> {
  if (!port) {
    throw Error("Port number not provided");
  }

  if (Deno.build.os == "windows") {
    await handleKillPortWindows(port);
  } else {
    await handleKillPort(port, options);
  }
}

async function handleKillPort(
  port: number,
  options: KillPortOptions = {},
): Promise<void> {
  const pid = await getPidPort(port, options);

  if (!pid) {
    throw Error(`No PID found for the port "${port}"`);
  }

  await killProcess(pid);
}

async function handleKillPortWindows(port: number): Promise<void> {
  const pid = await getPidPortWindows(port);

  if (!pid) {
    throw Error(`No PID found for the port "${port}"`);
  }

  await killProcessWindows(pid);
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

async function killProcessWindows(pid: number) {
  const cmd = Deno.run({
    cmd: ["cmd", "/c", "taskkill /PID " + `${pid}` + " /F"],
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
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

async function killProcess(pid: number) {
  const cmd = Deno.run({
    cmd: ["kill", "-9", `${pid}`],
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
}
