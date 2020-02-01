import { AlwaysArray, Getter } from '../types'
import { toArray } from '../internal/ToArray'

/**
 * Idea of this function is from Java Optional This function checks value to be non null or undefined. 
 * @see https://pavel-surinin.github.io/declarativejs/#/?id=optional
 */
export interface OptionalInterface<T> {
    /**
     * Transforms object 
     * @param mapper 
     * @returns optional with mapped object
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=map
     */
    map<R>(mapper: Getter<T, R>): OptionalInterface<NonNullable<R>>,
    /**
     * Checks optional value against condition in predicate,
     * if condition resolve to false, empty optional will be returned
     * @param predicate 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=filter
     */
    filter(predicate: (value: T) => boolean): OptionalInterface<T>,
    /**
     * If value already known or computed use this method to return if
     * optional is empty
     * @param value
     * @returns value if optional is empty
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=orelse
     */
    orElse(value: T): T
    /**
     * If value needs to be computed better to use lazy getter return if
     * optional is empty
     * @param value
     * @returns value if optional is empty
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=orelseget
     */
    orElseGet(supplier: () => T): T,
    /**
     * Throws an error if optional is empty.
     * @param errorMessage 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=orelsethrow
     */
    orElseThrow(errorMessage?: string): T | never
    /**
     * @returns true is value is present
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=ispresent
     */
    isPresent(): boolean,
    /**
     * @returns true is value is absent
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=isabsent
     */
    isAbsent(): boolean,
    ifPresent(consumer: () => void): void
    /**
     * Evaluate callback function if optional is empty
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=ifabsent
     */
    ifAbsent(consumer: () => void): void
    /**
     * @returns value from optional
     * @throws if value is not present
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=get
     */
    get(): NonNullable<T>,
    /**
     * If value is not present, empty array will be returned,
     * if value is single cardinality returns and array from one element,
     * if value is an array returns an array.
     * @returns value converted to an array
     * @throws if value is not present
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=toarray
     */
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