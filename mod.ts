interface KillPortOptions {
  protocol?: "tcp" | "udp";
}

export async function killPort(
  port: number,
  options: KillPortOptions = {},
): Promise<void> {
  if (Deno.build.os == 'windows') {
    throw Error("Windows OS not supported yet.");
  }

  if (!port) {
    throw Error("Port number not provided");
  }

  const pid = await getPidPort(port, options);

  if (!pid) {
    throw Error(`No PID found for the port "${port}"`);
  }

  await killProcess(pid);
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
