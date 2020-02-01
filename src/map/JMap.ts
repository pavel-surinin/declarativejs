import { MethodMap, Entry } from './MethodMap'

export type JMapType<T> = MethodMap<T> & { storage: Record<string, T> }

function Map<T>(this: JMapType<T>, init: Record<string, T> = {}) {
    this.storage = init
}

export const JMap: new <T>(init?: Record<string, T>) => MethodMap<T> = Map as any

Map.prototype = {
    put<T>(this: JMapType<T>, key: string, value: T) {
        this.storage[key] = value
    },
    get<T>(this: JMapType<T>, key: string): T | undefined {
        return this.storage[key]
    },
    keys<T>(this: JMapType<T>): string[] {
        return Object.keys(this.storage)
    },
    values<T>(this: JMapType<T>): T[] {
        return Object.keys(this.storage).map(key => this.storage[key])
    },
    containsKey(key: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.storage, key)
    },
    containsValue<T>(this: JMapType<T>, value: T): boolean {
        return this.values().some(v => v === value)
    },
    entries<T>(this: JMapType<T>): Entry<T>[] {
        return this.keys().map(k => ({
            key: k, value: this.storage[k]
        }))
    },
    size(): number {
        return this.keys().length
    },
    toObject<T>(this: JMapType<T>): { [keyof: string]: T } {
        return { ...this.storage }
    }
}
