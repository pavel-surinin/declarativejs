export interface Entry<T> {
    key: string,
    value: T
}

export interface MethodMap<T> {
    /**
     * 
     * @param key   
     * @param value 
     * @returns     value that was by this key before 
     */
    put(key: string, value: T): T | undefined
    get(key: string): T | undefined
    keys(): string[]
    values(): T[]
    containsKey(key: string): boolean
    containsValue(value: T): boolean
    entries(): Entry<T>[]
    size(): number
    toObject(): {[keyof: string]: T}
}

export class JMap<T> implements MethodMap<T> {
    
    private storage: {[keyof: string]: T} = {}

    constructor(obj?: {[keyof: string]: T}) {
        if (obj) {
            Object.keys(obj)
                .forEach(key => this.storage[key] = obj![key])
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
    
    toObject(): {[keyof: string]: T} {
        return {...this.storage}
    } 
}
