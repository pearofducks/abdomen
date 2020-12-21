import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import '../setup.mjs'

const test = suite('setup')

test('it automatically adds jsdom to global', () => {
  assert.ok(global.window)
  assert.ok(global.document)
  assert.is(typeof document.createElement, 'function')
})

test.run()
