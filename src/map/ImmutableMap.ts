import { JMap } from './JMap'
import { ImmutableBuilder } from './ImmutableBuilder'
import { MethodMap } from './MethodMap'

export class ImmutableMap<T> extends JMap<T> implements MethodMap<T> {
    static builder<T>(): ImmutableBuilder<T> {
        return new ImmutableBuilder<T>()
    }

    constructor(obj: { [keyof: string]: T }) {
        super(Object.isFrozen(obj) ? obj : Object.freeze(obj))
    }

    put(): never {
        throw new TypeError('ImmutableMap instance cannot be updated')
    }

    toObject(): Readonly<{ [keyof: string]: T }> {
        return Object.freeze(super.toObject())
    }
}