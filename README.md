<!-- Codecov-->

[![Coverage Status](https://coveralls.io/repos/github/ankarhem/secrecy-ts/badge.svg?branch=main)](https://coveralls.io/github/ankarhem/secrecy-ts?branch=main)

# secrecy-ts

A typescript port of the rust library [secrecy](https://lib.rs/crates/secrecy).

## Usage

```typescript
const secret = new Secret("password");

console.log(secret.expose()); // "password"

// If not explicitly exposed, the secret is hidden
console.log(secret); // "[REDACTED]"
console.log(String(secret)); // "[REDACTED]"
console.log(secret.toString()); // "[REDACTED]"
console.log(secret.valueOf().toString()); // "[REDACTED]"
console.log(`${secret}`); // "[REDACTED]"
console.log(JSON.stringify(secret)); // "[REDACTED]"
console.log(JSON.stringify({ secret: secret })); // "{"secret":"[REDACTED]"}"

// Compare secrets with other secrets or with non-secret values
console.log(secret.equals(secret)); // true
console.log(secret.equals("not a secret")); // false

// Clone secrets
const cloned = secret.clone();
console.log(cloned.expose()); // "password"
console.log(Object.is(secret, cloned)); // false
console.log(secret.equals(cloned)); // true

// Map the secret value to a new secret value
const mapped = secret.map((value) => value.length);
console.log(mapped.expose()); // 8

// Assert that a value is a secret
assertSecret(secret);
// If the value is not a secret, an error is thrown
assertSecret("not a secret"); // throws SecretError

// Check if a value is a secret
const something = new Secret("something") as unknown;
if (isSecret(something)) {
  console.log(something.expose()); // "something"
}
```
