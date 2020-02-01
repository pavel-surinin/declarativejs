import { AlwaysArray, Getter } from '../types'
import { toArray } from '../internal/ToArray'

export interface OptionalInterface<T> {
    map<R>(mapper: Getter<T, R>): OptionalInterface<NonNullable<R>>,
    filter(predicate: (value: T) => boolean): OptionalInterface<T>,
    orElse(value: T): T
    isPresent(): boolean,
    isAbsent(): boolean,
    orElseGet(supplier: () => T): T,
    orElseThrow(errorMessage?: string): T | never
    ifPresent(consumer: () => void): void
    ifAbsent(consumer: () => void): void
    get(): NonNullable<T>,
    toArray(): AlwaysArray<T>
}

type OptionalType<T> = OptionalInterface<T> & { value: T | undefined }

export const Optional: new <T>(value?: T) => OptionalInterface<T> = OptionalImpl as any

function OptionalImpl<T>(this: OptionalType<T>, value?: T) {
    this.value = value
}

OptionalImpl.prototype = {
    orElse<T>(this: OptionalType<T>, value: T): T {
        return this.isPresent() ? this.value! : value
    },
    isPresent<T>(this: OptionalType<T>): boolean {
        return this.value != undefined
    },
    isAbsent<T>(this: OptionalType<T>): boolean {
        return this.value == undefined
    },
    orElseGet<T>(this: OptionalType<T>, supplier: () => T): T {
        return this.isPresent() ? this.value! : supplier()
    },
    orElseThrow<T>(this: OptionalType<T>, errorMessage?: string): T | never {
        if (!this.isPresent()) {
            throw new Error(errorMessage)
        }
        return this.value!
    },
    ifPresent<T>(this: OptionalType<T>, consumer: () => void): void {
        if (this.isPresent()) {
            consumer()
        }
    },
    ifAbsent<T>(this: OptionalType<T>, consumer: () => void): void {
        if (this.isAbsent()) {
            consumer()
        }
    },
    get<T>(this: OptionalType<T>): NonNullable<T> {
        if (this.value == undefined) {
            throw new Error('Value is not defined')
        }
        return this.value!
    },
    map<T, R>(this: OptionalType<T>, mapper: Getter<T, R>): OptionalInterface<NonNullable<R>> {
        return this.isPresent() ? new Optional(mapper(this.value!)!)! : new Optional()
    },
    filter<T>(this: OptionalType<T>, predicate: (value: T) => boolean): OptionalInterface<T> {
        if (this.isPresent()) {
            return predicate(this.value!) ? this : new Optional()
        }
        return new Optional()
    },
    toArray<T>(this: OptionalType<T>): AlwaysArray<T> {
        return toArray(this.value)
    }
}

export const optional = function <T>(value?: T): OptionalInterface<T> {
    return new Optional(value)
}