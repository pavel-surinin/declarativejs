import { Mapper } from '../../src/array/mappers'

describe('Mappers', () => {
    it('should map to object vaues', () => {
        const values = [{a: 1, b: 2}, {a: 3, b: 4}].map(Mapper.toObjValues)
        expect(values).toMatchObject([[1, 2], [3, 4]])
    })
})