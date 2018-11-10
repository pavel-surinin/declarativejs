import { MethodMap, Entry } from './MethodMap'

export class JMap<T> implements MethodMap<T> {

    private storage: { [keyof: string]: T } = {}

    constructor(obj?: { [keyof: string]: T }) {
        if (obj) {
            this.storage = { ...obj }
        }
    }

    put(key: string, value: T) {
        const prevValue = this.storage[key]
        this.storage[key] = value
        return prevValue
    }

    get(key: string): T | undefined {
        return this.storage[key]
    }

    keys(): string[] {
        return Object.keys(this.storage)
    }

    values(): T[] {
        return Object.keys(this.storage).map(key => this.storage[key])
    }

    containsKey(key: string): boolean {
        return Object.keys(this.storage).some(k => k === key)
    }

    containsValue(value: T): boolean {
        return this.values().some(v => v === value)
    }

    entries(): Entry<T>[] {
        return this.keys().map(k => ({
            key: k, value: this.storage[k]
        }))
    }

    size(): number {
        return this.keys().length
    }

    toObject(): { [keyof: string]: T } {
        return this.storage
    }

}