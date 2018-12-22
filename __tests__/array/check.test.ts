describe('a', () => {
    it('b', () => {
        const arr = ['a', 'b', 'c']
        arr
            .filter(x => {
                console.log('filter' + x)
                return true
            })
            .map(x => {
                console.log('map' + x)
                return true
            })
    })
})