import { Predicate } from './InCase'

export const or = <T, R>(
    {mapper, value, predicate}
    : {mapper: (value: T) => R, value: T, predicate: Predicate<T>}
) => ({
        throw: (errMessage?: string) => {
            if (!predicate(value)) {
                throw new Error(errMessage)
            }
            return mapper(value)
        },
        else: (elseValue: R): R => predicate(value) ? mapper(value) : elseValue,
        elseGet: (elseProducer: () => R): R => predicate(value) ? mapper(value) : elseProducer()
})