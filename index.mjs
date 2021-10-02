import { JSDOM } from 'jsdom'

const defaultHtml = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>'

const notInternal = k => !k.startsWith('_')
const notAlreadyGlobal = k => !(k in global)
const windowAttributes = ['abdomen']
const setupWindowAttributes = w => windowAttributes.push(...Object.getOwnPropertyNames(w).filter(notInternal).filter(notAlreadyGlobal))

const addGlobalKey = obj => k => global[k] = obj[k]
const removeGlobalKey = k => delete global[k]
const isSetup = () => ('abdomen' in global)
export const teardown = () => isSetup() ? windowAttributes.forEach(removeGlobalKey) : null

// TODO: add jsdoc
export const setup = ({ html = defaultHtml, url = 'http://localhost:8080', ...options } = {}) => {
  const context = { teardown }
  if (isSetup()) return context

  const jsdom = new JSDOM(html, { url, pretendToBeVisual: true, ...options })
  const { window } = jsdom
  const { document } = window
  context.jsdom = jsdom

  if (windowAttributes.length == 1) setupWindowAttributes(window)
  windowAttributes.forEach(addGlobalKey(window))

  global.document = document
  global.window = window
  window.console = global.console

  global.abdomen = context

  return context
}
