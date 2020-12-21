# abdomen

a tiny utility to setup JSDOM for tests

## install

```shell
yarn add --dev abdomen
```

## use

abdomen supports both modules and commonjs

*modules*

```js
import 'abdomen/setup'
```

*commonjs*

```js
require('abdomen/setup')
```

## api

*manual setup*

```js
import { setup, teardown } from 'abdomen'

const context = setup()
// context has two properties available
// context.jsdom is a reference to the JSDOM instance
// context.teardown is the same teardown function as imported
```
