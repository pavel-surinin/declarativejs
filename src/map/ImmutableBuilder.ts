import { JMap } from './JMap'
import { ImmutableMap } from './ImmutableMap'

export class ImmutableBuilder<T> {

    private readonly map: JMap<T> = new JMap()

    put(key: string, value: T): T | undefined {
        const prevValue = this.map.get(key)
        this.map.put(key, value)
        return prevValue
    }
    get(key: string): T | undefined {
        return this.map.get(key)
    }
    buildMap(): ImmutableMap<T> {
        return new ImmutableMap(this.map.toObject())
    }
    buildObject(): Readonly<{ [keyof: string]: T }> {
        return Object.freeze(this.map.toObject())
    }
}
