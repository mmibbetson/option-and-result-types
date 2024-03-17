const None = Symbol("None");

class Option {
    #value;

    constructor(value) {
        this.#value = value;
    }

    static wrap(value) {
        return new Option(value);
    }

    isSome() {
        return this.#value !== None;
    }

    unwrap() {
        return this.#value;
    }

    unwrapOr(defaultValue) {
        return this.#value === None
            ? defaultValue
            : this.#value;
    }

    match(some, none) {
        return this.#value === None
            ? none(None)
            : some(this.#value);
    }

    tap(fn) {
        if (this.isSome()) {
            fn(this.#value);
        }

        return this;
    }

    map(fn) {
        return this.#value === None
            ? Option.wrap(None)
            : Option.wrap(fn(this.#value));
    }

    apply(fnOrNone) {
        return fnOrNone.match(
            some => this.isSome()
                    ? Option.wrap(some(this.#value))
                    : Option.wrap(None),
            none => Option.wrap(None)
        );
    }

    flatMap(fn) {
        return this.#value === None
            ? Option.wrap(None)
            : fn(this.#value);
    }
}

class Result {
    #value;

    constructor(value) {
        this.#value = value;
    }

    static wrap(value) {
        return new Result(value);
    }

    isOk() {
        return !(this.#value instanceof Error);
    }

    unwrap() {
        return this.#value;
    }

    unwrapOr(defaultValue) {
        return this.#value instanceof Error
            ? defaultValue
            : this.#value;
    }

    match(ok, err) {
        return this.#value instanceof Error
            ? err(this.#value)
            : ok(this.#value);
    }

    tap(fn) {
        if (this.isOk()) {
            fn(this.#value);
        }

        return this;
    }

    map(fn) {
        return this.#value instanceof Error
            ? Result.wrap(this.#value)
            : Result.wrap(fn(this.#value));
    }

    apply(fnOrErr) {
        return fnOrErr.match(
            ok => this.isOk()
                    ? Result.wrap(ok(this.#value))
                    : Result.wrap(this.#value),
            err => Result.wrap(err)
        );
    }

    flatMap(fn) {
        return this.#value instanceof Error
            ? Result.wrap(this.#value)
            : fn(this.#value);
    }
}

export { None, Option, Result }
