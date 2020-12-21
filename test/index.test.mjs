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

const toPercentage = n => (n * 100).toFixed(4) + '%'

test('it can safely be called multiple times', () => {
  assert.not.ok(global.window)
  setup()
  const mem1 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  Array.from({ length: 1000 }).forEach(setup)
  const mem2 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  const diff = (mem2 - mem1) / mem1
  // console.log("Memory diff from calling 1000x setup", toPercentage(diff))
  assert.ok(diff < 0.001)

  const mem3 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  Array.from({ length: 1000 }).forEach(teardown)
  const mem4 = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
  const diff2 = (mem4 - mem3) / mem3
  // console.log("Memory diff from calling 1000x teardown", toPercentage(diff2))
  assert.ok(diff2 < 0.001)
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
