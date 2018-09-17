import { Assert } from '../assert/Assert'
import { toArray } from '../ToArray';
import { Optional } from '../optional/Optional';

export type Predicate<T> = (val: T) => boolean

/**
 * Function that returns other functions that takes predicates, conditions and returns boolean as a result
 * @param v     value to check
 */
export const predict = <T>(v: T) => ({
    /**
     * Value must match all predicates to be {@code true}
     */
    all: (...predicates: Predicate<T>[]) => predicates.every(p => p(v)),
    /**
     * Value must match at least one predicate to be {@code true}
     */
    some: (...predicates: Predicate<T>[]) => predicates.some(p => p(v)),
    /**
     * Value must match none predicates to be {@code true}
     */
    none: (...predicates: Predicate<T>[]) => !predicates.every(p => p(v)),
    /**
     * Value to match one predicate to be {@code true}
     */
    only: (p: Predicate<T>) => p(v)
})

export class Then<T> {
    constructor(
        private readonly value: T,
        private readonly assert: (v: T) => boolean = () => true
    ) {}

    optional(): Optional<T> {
        if (this.assert(this.value)) {
            return new Optional(this.value)
        }
        return new Optional()
    }

    orElse(elseValue: T): T {
        if (this.assert(this.value)) {
            return this.value
        }
        return elseValue
    }

    orElseGet(elseSupplier: () => T): T {
        if (this.assert(this.value)) {
            return this.value
        }
        return elseSupplier()
    }
    
    orThrow(errMessage?: string): T | never {
        if (!this.assert(this.value)) {
            throw new Error(errMessage)
        }
        return this.value
    }

    throw(errMessage?: string): T | never {
        if (this.assert(this.value)) {
            throw new Error(errMessage)
        }
        return this.value
    }

    do(callback: () => void): void {
        if (this.assert(this.value)) {
            callback()
        }
    }

    map <R>(mapper: (value: T) => R): Then<R> {
        if (this.assert(this.value)) {
            return new Then(mapper(this.value), () => true)
        }
        // tslint:disable-next-line:no-any
        return new Then(undefined as any, () => false)
    }

    toArray() {
        if (this.assert(this.value)) {
            return toArray(this.value)
        }
        return []
    }
}

/**
 * Function that returns other functions that takes predicates, conditions and returns boolean as a result
 * @param v     value to check
 */
const meet = <T>(v: T) => ({
    all: (...predicates: Predicate<T>[]) => new Then(v, () => predicates.every(p => p(v))),
    some: (...predicates: Predicate<T>[]) => new Then(v, () => predicates.some(p => p(v))),
    none: (...predicates: Predicate<T>[]) => new Then(v, () => !predicates.every(p => p(v))),
    only: (p: Predicate<T>) => new Then(v, p)
})

export class InCase<T> {
    constructor(
        private readonly value: T
    ) {}
    true(): Then<T> {
        // tslint:disable-next-line:no-any
        return new Then(this.value, value => value as any === true)
    }
    false(): Then<T> {
        // tslint:disable-next-line:no-any
        return new Then(this.value, value => value as any === false)
    }
    present(): Then<T> {
        return new Then(this.value, Assert.isPresent)
    }
    notPresent(): Then<T> {
        return new Then(this.value, Assert.isNotPresent)
    }
    empty(): Then<T> {
        return new Then(this.value, Assert.isEmpty)
    }
    notEmpty(): Then<T> {
        return new Then(this.value, Assert.isNotEmpty)
    }
    defined(): Then<T> {
        return new Then(this.value, v => !Assert.isUndefined(v))
    }
    undefined(): Then<T> {
        return new Then(this.value, Assert.isUndefined)
    }
    null(): Then<T> {
        return new Then(this.value, Assert.isNull)
    }
    nonNull(): Then<T> {
        return new Then(this.value, v => !Assert.isNull(v))
    }
    typeof(typeName: Assert.JSType): Then<T> {
        return new Then(this.value, v => Assert.is(v).typeof(typeName))
    }
    notTypeof(typeName: Assert.JSType): Then<T> {
        return new Then(this.value, v => !Assert.is(v).typeof(typeName))
    }
    equals(valueToComapre: T, strict: boolean = true): Then<T> {
        return strict 
            ? new Then(this.value, v => v === valueToComapre)
            // tslint:disable-next-line
            : new Then(this.value, v => v == valueToComapre)
    }
    notEquals(typeName: Assert.JSType): Then<T> {
        return new Then(this.value, v => !Assert.is(v).typeof(typeName))
    }
    mathces() {
        return meet(this.value)
    }
}

export const inCase = <T> (value: T) => new InCase(value) 