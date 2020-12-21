import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { setup, teardown } from '../index.mjs'

const test = suite('index')

test.before.each(teardown)

test('it can add jsdom to global', () => {
  assert.not.ok(global.window)
  assert.not.ok(global.document)
  setup()
  assert.ok(global.window)
  assert.ok(global.document)
  assert.is(typeof document.createElement, 'function')
})

test('it returns a context object', () => {
  assert.not.ok(global.window)
  const { jsdom, teardown: localTeardown } = setup()
  assert.ok(global.window)
  assert.ok(jsdom.window)
  localTeardown()
  assert.not.ok(global.window)
})

test('it adds context to global', () => {
  assert.not.ok(global.abdomen)
  setup()
  assert.ok(global.abdomen)
  assert.is(typeof global.abdomen.teardown, 'function')
  global.abdomen.teardown()
  assert.not.ok(global.abdomen)
})

test('it has RAF available', () => {
  setup()
  assert.is(typeof global.window.requestAnimationFrame, 'function')
})

test('it can be setup and torn down multiple times', () => {
  assert.not.ok(global.window)
  setup()
  assert.ok(global.window)
  teardown()
  assert.not.ok(global.window)
  setup()
  assert.ok(global.window)
})

test.run()
