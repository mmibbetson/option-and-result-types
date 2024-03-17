const None = Symbol("None");

class Option<T> {
    private constructor(private readonly value: T | typeof None) {}

    static wrap<T>(value: T | typeof None): Option<T> {
        return new Option<T>(value);
    }

    isSome(): boolean {
        return this.value !== None;
    }

    unwrap(): T | typeof None {
        return this.value;
    }

    unwrapOr(defaultValue: T): T {
        return this.value === None
            ? defaultValue
            : this.value;
    }

    match<U>(some: (value: T) => U, none: (noneArg: typeof None) => U): U {
        return this.value === None
            ? none(None)
            : some(this.value);
    }

    tap(fn: (value: T) => void): Option<T> {
        if (this.isSome()) {
            fn(this.value as T);
        }

        return this;
    }

    map<U>(fn: (value: T) => U): Option<U> {
        return this.value === None
            ? Option.wrap<U>(None)
            : Option.wrap<U>(fn(this.value));
    }

    apply<U>(fnOrNone: Option<(value: T) => U>): Option<U> {
        return fnOrNone.match(
            some => this.isSome()
                    ? Option.wrap<U>(some(this.value as T))
                    : Option.wrap<U>(None),
            none => Option.wrap<U>(None)
        );
    }

    flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
        return this.value === None
            ? Option.wrap<U>(None)
            : fn(this.value);
    }
}

class Result<TOk, TErr extends Error> {
    private constructor(private readonly value: TOk | TErr) {}

    static wrap<TOk, TErr extends Error>(value: TOk | TErr): Result<TOk, TErr> {
        return new Result<TOk, TErr>(value);
    }

    isOk(): boolean {
        return !(this.value instanceof Error);
    }

    unwrap(): TOk | TErr {
        return this.value;
    }

    unwrapOr(defaultValue: TOk): TOk {
        return this.value instanceof Error
            ? defaultValue
            : this.value;
    }

    match<U>(ok: (value: TOk) => U, err: (error: TErr) => U): U {
        return this.value instanceof Error
            ? err(this.value)
            : ok(this.value);
    }

    tap(fn: (value: TOk) => void): Result<TOk, TErr> {
        if (this.isOk()) {
            fn(this.value as TOk);
        }

        return this;
    }

    map<UOk>(fn: (value: TOk) => UOk): Result<UOk, TErr> {
        return this.value instanceof Error
            ? Result.wrap<UOk, TErr>(this.value)
            : Result.wrap<UOk, TErr>(fn(this.value));
    }

    apply<UOk>(fnOrErr: Result<(value: TOk) => UOk, TErr>): Result<UOk, TErr> {
        return fnOrErr.match(
            ok => this.isOk()
                    ? Result.wrap<UOk, TErr>(ok(this.value as TOk))
                    : Result.wrap<UOk, TErr>(this.value as TErr),
            err => Result.wrap<UOk, TErr>(err)
        );
    }

    flatMap<UOk>(fn: (value: TOk) => Result<UOk, TErr>): Result<UOk, TErr> {
        return this.value instanceof Error
            ? Result.wrap<UOk, TErr>(this.value)
            : fn(this.value);
    }
}

export { None, Option, Result }
