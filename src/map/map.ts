import { inCase } from '..'

export class JMap<T> {
    
    private storage: {[keyof: string]: T} = {}

    constructor(obj?: {[keyof: string]: T}) {
        inCase(obj)
            .present
            .do(() => Object.keys(obj!).forEach(key => this.storage[key] = obj![key])) 
    }

    put = (key: string, value: T) => this.storage[key] = value

    get = (key: string): T | undefined => this.storage[key]

    keys = () => Object.keys(this.storage)

    values = () => Object.keys(this.storage).map(key => this.storage[key])

    containsKey = (key: string) => Object.keys(this.storage).some(k => k === key)

    containsValue = (value: T) => this.values().some(v => v === value)
}