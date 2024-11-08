import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { Secret } from "./mod.ts";

Deno.test("Secret - basic functionality", () => {
  const secret = new Secret("password");
  assertEquals(secret.expose(), "password");
  assertEquals(String(secret), "[REDACTED]");
  assertEquals(JSON.stringify(secret), '"[REDACTED]"');
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
  assert(!Object.is(original, cloned), "Cloned instance should be a different object reference");
  
  // Equals method should still return true
  assertEquals(original.equals(cloned), true);
});

Deno.test("Secret - immutability", () => {
  const secret = new Secret("password");
  
  // Attempt to modify the secret should fail
  try {
    (secret as any)[Symbol('secretValue')] = "hacked";
    throw new Error("Should not be able to modify secret");
  } catch (error) {
    assertEquals(error instanceof TypeError, true);
  }
});

Deno.test("Secret - type safety", () => {
  const numberSecret = new Secret(42);
  const stringSecret = new Secret("42");
  
  assertEquals(numberSecret.expose(), 42);
  assertEquals(typeof numberSecret.expose(), "number");
  assertEquals(stringSecret.expose(), "42");
  assertEquals(typeof stringSecret.expose(), "string");
});
