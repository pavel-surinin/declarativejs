const objectPrototype = Object.prototype
const hasOwnProperty = objectPrototype.hasOwnProperty

export default function deepEqual(a: any, b: any): boolean {
    if (a === b) {
        return true
    }

    if (a && b && typeof a === 'object' && typeof b === 'object') {
        if (a.constructor !== b.constructor) {
            return false
        }

        if (Array.isArray(a)) {
            if (a.length !== b.length) {
                return false
            }
            for (let i = a.length - 1; i >= 0; i--) {
                if (!deepEqual(a[i], b[i])) {
                    return false
                }
            }
            return true
        }

        if (a.constructor === RegExp) {
            return a.source === b.source && a.flags === b.flags
        }

        if (a.valueOf !== objectPrototype.valueOf) {
            return a.valueOf() === b.valueOf()
        }

        if (a.toString !== objectPrototype.toString) {
            return a.toString() === b.toString()
        }

        const keys = Object.keys(a)
        if (keys.length !== Object.keys(b).length) {
            return false
        }

        for (let i = keys.length - 1; i >= 0; i--) {
            if (!hasOwnProperty.call(b, keys[i])) {
                return false
            }
        }

        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i]
            if (!deepEqual(a[key], b[key])) {
                return false
            }
        }

        return true
    }

    return a !== a && b !== b
}
