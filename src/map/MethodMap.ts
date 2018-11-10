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
    toObject(): { [keyof: string]: T }
}