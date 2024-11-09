import { assertEquals } from "@std/assert";

Deno.test("Secret - hidden from stdout and stderr", async () => {
  // spawn a process and verify that stdout is redacted
  const command = new Deno.Command("deno", {
    args: ["./tests/console_log.ts"],
    stdout: "piped",
    stderr: "piped",
    stdin: "piped",
  });
  const child = command.spawn();
  child.output().then((value) => {
    const output = new TextDecoder().decode(value.stdout);
    assertEquals(output, "[REDACTED]\n");
  });

  const status = await child.status;
  assertEquals(status.success, true);
  child.stdin.close();
});
