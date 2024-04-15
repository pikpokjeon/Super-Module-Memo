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

const verifyTagName = (tag) => 
{
  element = document.createElement(tag)
  if (element) return element
  return undefined
}
// TYPE 0-[program], 1-<tag>, 2-/attrName
const computeStr = (str) =>
{
  switch (str) {
    case '[':
      return ({ type: 0, value: 'program', condition: true })
    case ']':
      return ({ type: 0, value: 'program', condition: false })
    case '<':
      return ({ type: 1, value: 'tag', condition: true })
    case '>':
      return ({ type: 1, value: 'tag', condition: false })
    case '/':
      return ({ type: 2, value: 'attribute', condition: true })
    case ':':
      return ({ type: 3, value: 'attribute', condition: true })
  }
}

const parser = (data, htmlStr) =>
{
  html = htmlStr.trim().split('\n')
  parserType = undefined

  for (let i = 0; i < html.length; i++) {

    scope = undefined
    data = ''
    prev = ''
    hold = ''

    for (let n = 0; n < html[ i ].length; n++) {
      current = html[ i ][ n ]
      const { type, value, condition } = computeStr(current)
      console.log(type, value, condition)
      if (value === 'program') {
        if (!scope) scope = value
        else if (scope && !condition) scope = false
        data += current
      }
    }

  }

}
const Template = (parent, props) => 
{
  DATA = {
    parent,
    input: Array.from(10).fill('test')
  }
  DEFINITION = {
    html: `
      [template:html]

      @LOOP:for-loop => use $(data, index) in $input

      ul# id:"example-ul"

      /@LOOP-> use/
      - li# class:"example-li" id:"item-$(use.index)"
      -- div# text:$use.data
      
      section# text:"my-world"
    `
  }

  console.log(DEFINITION.html, parser(DATA, DEFINITION.html))


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

  Template()
}


main()
