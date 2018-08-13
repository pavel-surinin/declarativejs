export interface Entry<T> {
    key: string,
    value: T
}

export class JMap<T> {
    
    private storage: {[keyof: string]: T} = {}

    constructor(obj?: {[keyof: string]: T}) {
        if (obj) {
            Object.keys(obj)
                .forEach(key => this.storage[key] = obj![key])
        }
    }

    put(key: string, value: T) {
        this.storage[key] = value
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
}
