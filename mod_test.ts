import { assert, assertEquals } from "@std/assert";
import { Secret } from "./mod.ts";

Deno.test("Secret - basic functionality", () => {
  const secret = new Secret("password");
  assertEquals(secret.expose(), "password");
  assertEquals(String(secret), "[REDACTED]");
  assertEquals(secret.toString(), "[REDACTED]");
  assertEquals(JSON.stringify(secret), '"[REDACTED]"');
});

Deno.test("Secret - console.log", async () => {
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

Deno.test("Secret - type safety", () => {
  const numberSecret = new Secret(42);
  const stringSecret = new Secret("42");
  const booleanSecret = new Secret(true);
  const arraySecret = new Secret([1, 2, 3]);
  const objectSecret = new Secret({ key: "value" });

  // Number
  assertEquals(numberSecret.expose(), 42);
  assertEquals(typeof numberSecret.expose(), "number");

  // String
  assertEquals(stringSecret.expose(), "42");
  assertEquals(typeof stringSecret.expose(), "string");

  // Boolean
  assertEquals(booleanSecret.expose(), true);
  assertEquals(typeof booleanSecret.expose(), "boolean");

  // Array
  assertEquals(arraySecret.expose(), [1, 2, 3]);
  assertEquals(typeof arraySecret.expose(), "object");

  // Object
  assertEquals(objectSecret.expose(), { key: "value" });
  assertEquals(typeof objectSecret.expose(), "object");
});
