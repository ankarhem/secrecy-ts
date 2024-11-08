import { assert, assertEquals } from "@std/assert";
import { Secret } from "./mod.ts";

Deno.test("Secret - can expose", () => {
  const secret = new Secret("password");
  assertEquals(secret.expose(), "password");
});

Deno.test("Secret - hidden in serialization", () => {
  const secret = new Secret("password");
  assertEquals(String(secret), "[REDACTED]");
  assertEquals(secret.toString(), "[REDACTED]");
  assertEquals(JSON.stringify(secret), '"[REDACTED]"');
  assertEquals(
    JSON.stringify({
      inside: secret,
    }),
    '{"inside":"[REDACTED]"}'
  );
});

Deno.test("Secret - hidden from stdout and stderr", async () => {
  // spawn a process and verify that stdout is redacted
  const command = new Deno.Command("deno", {
    args: ["console_test.ts"],
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

Deno.test("Secret - hidden property accessibility", () => {
  const secret = new Secret("password");
  // deno-lint-ignore no-explicit-any
  assertEquals((secret as any)[Symbol("secretValue")], undefined);
});

Deno.test("Secret - map transformation", () => {
  const secret = new Secret("password");
  const lengthSecret = secret.map((s) => s.length);
  assertEquals(lengthSecret.expose(), 8);
});

Deno.test("Secret - equality comparison", () => {
  const secret1 = new Secret("password");
  const secret2 = new Secret("password");
  const secret3 = new Secret("different");

  assertEquals(secret1.equals(secret2), true);
  assertEquals(secret1.equals(secret3), false);
});

Deno.test("Secret - cloning", () => {
  const original = new Secret("password");
  const cloned = original.clone();

  // Values should be equal
  assertEquals(original.expose(), cloned.expose());

  // But instances should be different
  assert(
    !Object.is(original, cloned),
    "Cloned instance should be a different object reference"
  );

  // Equals method should still return true
  assertEquals(original.equals(cloned), true);
});
