export namespace Mapper {
    /**
     * returns object values
     * @param obj object
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=toobjvalues
     */
    export const toObjValues = <T>(obj: { [keyof: string]: T }): T[] => {
        return Object.keys(obj).map(k => obj[k])
    }
}