import { Assert } from '../assert/Assert'
import { toArray, AlwaysArray } from '../ToArray';

export type Fuction<T, R> = (from: T) => R
export type NonNull<R> = R extends undefined | null ? R : R

export class Optional<T> {

    constructor(private readonly value?: T) { }

    orElse(value: T): T {
        return this.isPresent()
            ? this.value!
            : value
    }
    orElseGet(supplier: () => T): T {
        return this.isPresent()
            ? this.value!
            : supplier()
    }
    orElseThrow(errorMessage?: string): T | never {
        if (!this.isPresent()) {
            throw new Error(errorMessage)
        }
        return this.value!
    }

    isPresent(): boolean {
        return Assert.isPresent(this.value)
    }

    isAbsent(): boolean {
        return Assert.isNotPresent(this.value)
    }

    ifPresent(consumer: () => void): void {
        if (this.isPresent()) {
            consumer()
        }
    }

    ifAbsent(consumer: () => void): void {
        if (this.isAbsent()) {
            consumer()
        }
    }

    get() {
        if (Assert.isNotPresent(this.value)) {
            throw new Error('Value is not defined')
        }
        return this.value!
    }

    map<R>(mapper: Fuction<T, R>): Optional<NonNull<R>> {
        return this.isPresent() ? new Optional(mapper(this.value!)!)! : new Optional()
    }

    filter(predicate: (value?: T) => boolean): Optional<T> {
        return predicate(this.value) ? this : new Optional()
    }

    toArray(): AlwaysArray<T> {
        return toArray(this.value)
    }

}

export const optional = function <T>(value?: T): Optional<T> {
    return new Optional(value)
}