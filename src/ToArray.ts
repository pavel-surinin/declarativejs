// tslint:disable-next-line
export type AlwaysArray<T> = T extends any[] ? T : T[];

export const toArray = <T>(value?: T): AlwaysArray<T> => {
    if ( value !== null && value !== void 0) {
        if (Array.isArray(value)) {
            return value as AlwaysArray<T>
        }
        return [value] as AlwaysArray<T>
    } else {
        // tslint:disable-next-line
        return [] as any as AlwaysArray<T>
    }
}