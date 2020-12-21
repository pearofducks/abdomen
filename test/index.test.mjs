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

test('it can safely be called multiple times', () => {
  assert.not.ok(global.window)
  setup()
  const mem1 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  Array.from({ length: 1000 }).forEach(setup)
  const mem2 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  assert.ok((mem1 - mem2) < 0.1)

  const mem3 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  Array.from({ length: 1000 }).forEach(teardown)
  const mem4 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  assert.ok((mem3 - mem4) < 0.1)
})

test.run()
