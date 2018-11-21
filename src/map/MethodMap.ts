export interface Entry<T> {
    key: string,
    value: T
}
export interface MethodMap<T> {
    put(key: string, value: T): void
    get(key: string): T | undefined
    keys(): string[]
    values(): T[]
    containsKey(key: string): boolean
    containsValue(value: T): boolean
    entries(): Entry<T>[]
    size(): number
    toObject(): { [keyof: string]: T }
}