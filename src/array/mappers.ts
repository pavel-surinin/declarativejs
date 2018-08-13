export namespace Mapper {
    export const toObjValues = <T> (obj: {[keyof: string]: T}): T[] => {
        return Object.keys(obj).map(k => obj[k])
    }
}