import { Assert } from '../assert/Assert'
import { AlwaysArray, Getter } from '../types'
import { toArray } from '../internal/ToArray'

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

    get(): NonNullable<T> {
        if (Assert.isNotPresent(this.value)) {
            throw new Error('Value is not defined')
        }
        return this.value!
    }

    map<R>(mapper: Getter<T, R>): Optional<NonNullable<R>> {
        return this.isPresent() ? new Optional(mapper(this.value!)!)! : new Optional()
    }

    filter(predicate: (value: T) => boolean): Optional<T> {
        if (this.isPresent()) {
            return predicate(this.value!) ? this : new Optional()
        }
        return new Optional()
    }

    toArray(): AlwaysArray<T> {
        return toArray(this.value)
    }

}

export const optional = function <T>(value?: T): Optional<T> {
    return new Optional(value)
}