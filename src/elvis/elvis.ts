export interface ElvisResult<T> {
    value?: T,
    error?: Error
}

export const get = <T>(geter: () => T, value?: T): ElvisResult<T> => {
    try {
        return { value: geter() }
    } catch (error) {
        return { error, value }
    }
}