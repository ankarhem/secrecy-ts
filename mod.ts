// Symbol used for private access to the inner value
const secretValue = Symbol('secretValue');

/**
 * A secret value that cannot be accessed directly.
 * 
 * @example
 * const secret = secret('password');
 * console.log(secret); // '[REDACTED]'
 * console.log(secret.expose()); // 'password'
 */
export class Secret<T> {
    private [secretValue]: T;
    private static redactedString = '[REDACTED]';

    constructor(value: T) {
        this[secretValue] = value;
        
        // Prevent the secret from appearing in console.log
        Object.defineProperty(this, 'toString', {
            value: () => Secret.redactedString,
            enumerable: false,
            writable: false,
            configurable: false
        });

        // Prevent JSON serialization
        Object.defineProperty(this, 'toJSON', {
            value: () => Secret.redactedString,
            enumerable: false,
            writable: false,
            configurable: false
        });

        // Freeze the object to prevent modifications
        Object.freeze(this);
    }

    /**
     * Exposes the secret value.
     * 
     * @returns The secret value.
     * 
     * @example
     * const secret = secret('password');
     * console.log(secret.expose()); // 'password'
     */
    expose(): T {
        return this[secretValue];
    }

    /**
     * Maps the secret value to a new secret value.
     * 
     * @param fn - The function to map the secret value.
     * @returns A new secret with the mapped value.
     * 
     * @example
     * const secret = secret('password');
     * const mapped = secret.map(value => value.length);
     * console.log(mapped.expose()); // 8
     */
    map<U>(fn: (value: T) => U): Secret<U> {
        return new Secret(fn(this[secretValue]));
    }

    /**
     * Compares the secret value to another secret value.
     * 
     * @param other - The other secret to compare to.
     * @returns Whether the secret values are equal.
     * 
     * @example
     * const secret1 = secret('password');
     * const secret2 = secret('password');
     * console.log(secret1.equals(secret2)); // true
     * 
     * const secret2 = secret('password1');
     * console.log(secret1.equals(secret2)); // false
     */
    equals(other: Secret<T>): boolean {
        if (!(other instanceof Secret)) {
            return false;
        }
        return this[secretValue] === other[secretValue];
    }

    /**
     * Clones the secret value.
     * 
     * @returns A new secret with the same value.
     * 
     * @example
     * const secret = secret('password');
     * const cloned = secret.clone();
     * console.log(cloned.expose()); // 'password'
     * console.log(secret === cloned); // false
     * console.log(secret.equals(cloned)); // true
     */
    clone(): Secret<T> {
        return new Secret(this[secretValue]);
    }
}