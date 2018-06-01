
# declarative-js
Open source javascript library for declarative coding

# Table of Contents
1. [is](#is)
2. [inCase](#incase)
3. [optional](#optional)
4. [Array Functions](#ArrayFunctions)
    - [Filters](#Filters)
    - [Collectors](#Collectors)
5. [JMap](#JMap)
## IS

`null` assertion
```javascript
    import { is } from 'declarative-js'

    is(myVar).null
    is(myVar).not.null
```

`unefined` assertion
```javascript
    is(myVar).undefined
    is(myVar).not.undefined
```

`present` assertion
```javascript
    is(myVar).present
    is(myVar).not.present
```

`empty` assertion. Assert is `string` is empty or `array` is empty or `object` is empty, otherwise returns true
```javascript
    is({}).empty //true
    is([]).empty //true
    is('').empty //true
    is(myVar).not.empty
```

`typeof` assertion. Type can be asserted with these values: `'undefined' | 'object' | 'boolean' | 'number' | 'string'`
```javascript
    is(myVar).typeof('string')
    is(myVar).not.typeof('string')
```

`equals` assertion. Assert with `===`
```javascript
    is(mayVar).equals('dummy')
    is(mayVar).not.equals('dummy')
```

`meets` assertion. Assert to meet predicates `(value: T) => boolean`
```javascript
    //predicates
    const isA = s => s === 'a'
    const isC = s => s === 'c'
    const isNotB = s => s !== 'b'
    //assertion
    is('a').meets.all(isA, isNotB)  //true
    is('a').meets.some(isA, isC)    //true
    is('d').meets.none(isA, isC)    //true
    is('c').meets.only(isC)         //true
```

## INCASE

Function `inCase` can be splitted in two parts: 

1. `inCase` some condition is `true` (all condition are the same as in `is` assertion functions)

2. Do something

```javascript
    import { inCase } from 'declarative-js'

    inCase(myVar).empty.do(() => console.warn('myVar is empty'))
```

With javascript You can do that:
```javascript
    myVar === '' && console.warn('myVar is empty')
```
But not all linter rules will allow to do that, It is harder to understand for newbies.
In that cases what I saw in other projects, was:
```javascript
    if(myVar === '') {
        console.warn(() => 'myVar is empty')
    }
```
Which is great, but if it is in arrow function...
```javascript
    myVar => {
        if(myVar === '') {
            console.warn(() => 'myVar is empty')
        }
    }
```
### Asseritng
Examples of asserting part:
```javascript
    import { inCase } from 'declarative-js'

    inCase(myVar).empty.do(() => console.warn('warn'))
    inCase(myVar).not.empty.do(() => console.warn('warn'))
    inCase(myVar).null.do(() => console.warn('warn'))
    inCase(myVar).not.null.do(() => console.warn('warn'))
    inCase(myVar).undefined.do(() => console.warn('warn'))
    inCase(myVar).not.undefined.do(() => console.warn('warn'))
    inCase(myVar).present.do(() => console.warn('warn'))
    inCase(myVar).not.present.do(() => console.warn('warn'))
    inCase(myVar)
        .meets.all(x => x ==='a', x => x ==='b')
        .do(() => console.warn('warn'))
    inCase(myVar)
        .meets.some(x => x ==='a', x => x ==='b')
        .do(() => console.warn('warn'))
    inCase(myVar)
        .meets.none(x => x ==='a', x => x ==='b')
        .do(() => console.warn('warn'))
    inCase(myVar)
        .meets.only(x => x ==='a')
        .do(() => console.warn('warn'))            
```
### Action
Examples what will be if asserting returns true

#### incase(value).\<predicate>.do
`do` that takes callback function `() => void` as a parameter.
```javascript
    inCase(myVar).empty
        .do(() => console.warn('warn'))
```
#### incase(value).\<predicate>.throw
`throw` that will throw `Error`, takes `string` as a paramter, that will be an error message
```javascript
    inCase(myVar).empty
        .throw('myVar is Empty')
```
or with no message
```javascript
    inCase(myVar).empty.throw()
```

#### incase(value).\<predicate>.map
`map` that will map value, takes function `(value: T) => R` as a parameter

```javascript
    import { inCase } from 'declarative-js'

    inCase(name).not.empty
        .map(n => `Dear ${n}, please do something...`)
        .map(msg => ({
            username: name,
            message: msg
        }))
        .or.else({
            username: 'incognito',
            message: 'please login'
        })
```

`map` after mapping has these methods
- get `map(toSomething).get()` that will return mapped value in case condition is `true` or throw an error id condition is `false`
- or.else `.map(toSomething).or.else(0)` that will return value if assertion part is false
- or.elseGet `.map(toSomething).or.elseGet(() => calculate())` is lazy callback to return a value if assertion part is false
- or.throw `.map(toSomething).or.throw('some message')` that will throw `Error` is assertion part is false

## OPTIONAL

Idea of this function is from [Java Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)

### optional(value).isPresent

```javascript
    optional(myVar).isPresent() //true or false
```

### optional(value).ifPresent

```javascript
    optional(myVar).ifPresent(() => console.warn('I am here'))
```

### optional(value).map

Every map call is checking is mapped value defined.
If mapped value is undefined, other `map` calls will not be executed.  

```javascript
    import { optional } from 'declarative-js'

    const toGreeting = name => `Hi, ${name}!`
    optional(myVar)
        .map(x => x.event)
        .map(event => event.name)
        .map(toGreeting)
        .get() // if some map evaluated to undefined an error will be thrown
```

### optional(value).map(...).filter

After `map` call `.filter()` method is available, that accepts predicate `(value: T) => boolean`. If filters predicate returns `false`, other piped `filter` or `map` calls will no be executed. 

```javascript
    import { optional } from 'declarative-js'

    const toGreeting = name => `Hi, ${name}!`
    optional(myVar)
        .map(x => x.event)
        .map(event => event.name)
        .filter(name => name === 'John')
        .map(toGreeting)
        .get() // if filter returned false an error will be thrown
```

### optional(value).map(...).or

After mapping if some value was `undefined` or `filter` in pipe returned `fasle`, `or` functions will be called. These functions are the same as `or` in `inCase` function.

```javascript
    import { optional } from 'declarative-js'

    const toGreeting = name => `Hi, ${name}!`
    optional(myVar)
        .map(x => x.event)
        .map(event => event.name)
        .filter(name => name === 'John')
        .map(toGreeting)
        .or.else('Hi stranger')
        // or.elseGet(() => 'Hi stranger')
        // or.throw('Ups, somethng went worng')
```
- or.else `.map(toSomething).or.else(0)` that will return value if assertion part is false
- or.elseGet `.map(toSomething).or.elseGet(() => calculate())` is lazy callback to return a value if assertion part is false
- or.throw `.map(toSomething).or.throw('some message')` that will throw `Error` is assertion part is false

## ArrayFunctions

### Filters

#### filter out undefined
```javascript
import { toBe } from 'declarative-js'

[undefined, 'a', 'b'].filter(toBe.present) // ['a', 'b']
```

#### filter out empty
```javascript
import { toBe } from 'declarative-js'

['', 'a', 'b'].filter(toBe.notEmpty) // ['a', 'b']
```

#### filter to be equal to ...
```javascript
import { toBe } from 'declarative-js'

['', 'a', 'b', 'a', 'c'].filter(toBe.equal('a')) // ['a', 'a']
```

#### filter to be not equal to ...
```javascript
import { toBe } from 'declarative-js'

['a', 'b', 'a', 'c'].filter(toBe.notEqual('a')) // ['b', 'c']
```

#### filter to be unique
it works on primitives and objects as well. This function comparing references and content.

```javascript
import { toBe } from 'declarative-js'

['a', 'b', 'a', 'a', 'c'].filter(toBe.unique) // ['a', 'b', 'c']
```

```javascript
import { toBe } from 'declarative-js'

[{a: 1}, {a: 1}, {a: 2}].filter(toBe.unique) // [{a: 1}, {a: 2}]
```

### Collectors

#### grpupBy

Groups by key resoved from callback to [JMap](#Jmap) where key is `string` and value is an `array` of items
        
```javascript
import { Collectors } from 'declarative-js'
import groupBy = Collectors.groupBy

['a', 'a', 'b'].reduce(groupBy(v => v), new JMap()) // {a: ['a', 'a'], b: ['b'] }
reduced.keys() //   ['a', 'b']
reduced.values() // [['a', 'a'], ['b']]

``` 

#### flat
Flats 2d `array` to `array` 
        
```javascript
import { Collectors } from 'declarative-js'
import flat = Collectors.flat

[[1, 2], [2, 3], [3, 4]].reduce(flat) // [1, 2, 3, 4, 5, 6]
```        

#### toMap

Collects items by key, from callback to [JMap](#Jmap). If function resolves key, that already exists it will throwan `Error`
  
```javascript
import { Collectors } from 'declarative-js'
import toMap = Collectors.toMap

const reduced = [{name: 'john'}, {name: 'mike'}].reduce(toMap(va => va.name), new JMap())
reduced.keys() // ['john', 'mike']
reduced.values() // [{name: 'john'}, {name: 'mike'}]
```   

#### toObject
Collects items to object by key from callback

```javascript
import { Collectors } from 'declarative-js'
import toObject = Collectors.toObject

[{name: 'john'}, {name: 'mike'}].reduce(toObject(va => va.name), {})
// {
//    john: {name: 'john'},
//    mike: {name: 'mike'}
// }
```

## JMap

Map that has all required functions to comfortably work with it 
```javascript
const jmap = new JMap()
jmap.put('mike', 1)
jmap.put('john', 2)

sample.keys() // ['mike', 'john']
sample.values() // [1, 2]
sample.get('mike') // 1
sample.containsValue(1) // true
sample.containsKey('mike') //false
```
This map can be created from `object` as well.
```javascript
const map = new JMap({a: 1, b: 2})

```
