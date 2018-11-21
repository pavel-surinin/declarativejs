import { JMap } from './JMap'
import { ImmutableMap } from './ImmutableMap'
import { MethodMap, Entry } from './MethodMap'

export class ImmutableBuilder<T> implements MethodMap<T> {
    private readonly map: JMap<T> = new JMap()

    keys(): string[] {
        throw new Error('Method not implemented.')
    }
    values(): T[] {
        throw new Error('Method not implemented.')
    }
    containsKey(key: string): boolean {
        return this.map.containsKey(key)
    }
    containsValue(): boolean {
        throw new Error('Method not implemented.')
    }
    entries(): Entry<T>[] {
        throw new Error('Method not implemented.')
    }
    size(): number {
        throw new Error('Method not implemented.')
    }
    toObject(): { [keyof: string]: T; } {
        throw new Error('Method not implemented.')
    }

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
