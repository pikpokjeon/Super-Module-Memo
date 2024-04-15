const _id = (str) => document.getElementById(str)

const fetchMemo = async () =>
{

}
const getDOMNamespace = async (el) =>
{
  console.log(el)
  ID = el.getAttribute('id')
  if (ID !== '') return ID
  else if (el.classList) return Array.from(el.classList)
  else return false
}

const objectStore = async (obj, variable) =>
{
  const copied = { ...obj }
  const names = await getDOMNamespace(variable)
  console.log(names, variable)
  console.log(variable.name, variable.tagName)
  if (typeof variable === 'number') copied[ 'number' ] = variable
  else if (variable[ Symbol.toStringTag ]) copied[ variable[ Symbol.toStringTag ] ] = variable
  else if (variable.name === undefined) {
    const names = await getDOMNamespace(variable)
    console.log(names)
    console.log(111)
  }
  else if (Array.isArray(variable)) copied[ 'lists' ] = variable
  else if (typeof variable === 'function') copied[ variable.name ] = variable
  return copied
}



const applyAttribute = (el, attr = {}, text) =>
{
  for (const [ t, v ] of Object.entries(attr)) {
    el.setAttribute(t, v)
  }
  if (text) el.textContent = text
  return el
}

const genElement = (type) => (tag, at) => async () =>
{
  el = type === 'svg'
    ? document.createElementNS('http://www.w3.org/2000/svg', type)
    : document.createElement(tag)
  if (!at) return el
  const { attribute, text } = at
  el = applyAttribute(el, attribute, text)
  return el
}

const generateDOM = {
  svg: genElement('svg'),
  html: genElement('html')
}

const _renderDOM = async (i, parent, renderers, array) =>
{
  console.log(i, renderers)
  if (i < array.length) {
    const element = renderers.shift()

    parent.append(await element())
    return _renderDOM(i + 1, parent, renderers, array)
  } else return parent

}
const renderDOM = async (parent, ...renderers) =>
{
  parent = await parent()
  let obj_store = { ...objectStore({}, parent) }

  const obj = await _renderDOM(0, parent, renderers, [ ...renderers ])
  return obj
}


const main = async () =>
{
  VIEW = 'view'
  TEST_LIST = new Array(10).fill('example-').map((str, i) => str + (i + 1))
  const view_dom = _id(VIEW)
  view_dom.innerText = VIEW

  const { svg, html } = generateDOM
  const example_list = await renderDOM(html('ul', { attribute: { id: 'title' } }),
    ...TEST_LIST.map(str => html('li', { attribute: { class: `item ${str}` }, text: str })))
  const example_root = await renderDOM(() => view_dom, html('div', { text: 'render-example' }))

  await renderDOM(() => example_root, () => example_list)
}


main()
