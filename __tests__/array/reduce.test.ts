import { Collectors } from '../../src/array/reduce'
import { JMap } from '../../src/map/map'
import groupBy = Collectors.groupBy
import flat = Collectors.flat
import toMap = Collectors.toMap
import toObject = Collectors.toObject

describe('Collectors', () => {
    it('should grpupBy to JMap', () => {
        const reduced = ['a', 'a', 'b'].reduce(groupBy(v => v), new JMap())
        expect(reduced.keys()).toMatchObject(['a', 'b'])
        expect(reduced.values()).toMatchObject([['a', 'a'], ['b']])
    })
    it('should flat from 2d array to simple array', () => {
        const reduced = [[1, 2], [2, 3], [3, 4]]
            .reduce(flat)
        expect(reduced).toHaveLength(6)
    })
    it('should collect to map', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'mike'}]
        const reduced = arr
            .reduce(toMap(va => va.name), new JMap())
        expect(reduced.keys()).toMatchObject(['john', 'mike'])
        expect(reduced.values()).toMatchObject([{name: 'john'}, {name: 'mike'}])
    })
    it('should throw if key already exists collecting to map', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'john'}]
        expect(() => arr.reduce(toMap(va => va.name), new JMap())).toThrow('Key: "john" has duplicates')
    })
    it('should collect to object', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'mike'}]
        const reduced = arr
            .reduce(toObject(va => va.name), {})
        expect(reduced).toMatchObject(
            {
                john: {name: 'john'},
                mike: {name: 'mike'}
            }
        )
    })
    it('should throw if key already exists collecting to object', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'john'}]
        expect(() => arr.reduce(toObject(va => va.name), {})).toThrow('Key: "john" has duplicates')
    })
})
