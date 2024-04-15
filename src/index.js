const _id = (str) => document.getElementById(str)

const applyAttribute = (el, attr = {}, text) =>
{
  for (const [ t, v ] of Object.entries(attr)) {
    el.setAttribute(t, v)
  }
  if (text) el.textContent = text
  return el
}

const genElement = (type) => (tag) => (at) => async () =>
{
  el = type === 'svg'
    ? document.createElementNS('http://www.w3.org/2000/svg', type)
    : document.createElement(tag)
  if (!at) return el
  const { attribute, text } = at // attributes
  el = applyAttribute(el, attribute, text)
  return el
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
    case '=':
      return ({ type: 1, value: 'equal', condition: true })
    case '+':
      return ({ type: 2, value: 'append', condition: true })
    case '(':
      return ({ type: 3, value: 'paren', condition: true })
    case ')':
      return ({ type: 3, value: 'paren', condition: false })
    case '"':
      return ({ type: 4, value: 'string', condition: true })
    case '$':
      return ({ type: 5, value: 'data', condition: true })
    default:
      return ({ type: 6, value: 'literal', condition: true })
  }
}

const getFunctionCall = (code_type, functionArr) =>
{
  switch (code_type) {
    case 'type':
      functionArr.push(genElement)
  }
  return functionArr
}

const generatedWritingCode = (code, _data, codeArr, letterSequence, flagScope) =>
{
  console.warn(`[generatedWritingCode]`, code)
  if (!codeArr) codeArr = [ ...code.split('').map(c => c.trim()) ]

  if (codeArr.length < 1) return _data
  else {
    const letter = codeArr.shift()

    const { type, value, condition } = computeStr(letter)
    console.log('<----------------------------------------')
    console.log(`[type]-${type},\n [value]-${value},\n [condition]-${condition}`)
    console.warn(`[char]- ${letter}`)
    console.log('---------------------------------------->')

    if (value === 'program') {
      if (condition) {
        flagScope = true
      } else {
        flagScope = false
      }
      return generatedWritingCode(code, _data, codeArr, letterSequence, flagScope)
    }


    if (flagScope) {
      if (value === 'equal') {
        console.error(letterSequence)

        Reflect.set(_data, 'code_type', letterSequence)

      } else {
        letterSequence += letter


      }

      return generatedWritingCode(code, _data, codeArr, letterSequence, flagScope)


    } else {
      return _data
    }

  }
}


const Template = (parent, props) => 
{
  DATA = {
    parent,
    input: Array.from(10).fill('test')
  }
  HTML = {

  }
  DEFINITION = {
    code: `
      [type=html]
      [root=parent]
      [tag=ul id="list" class="ul-list"]
      +[tag=li loop-data=$DATA.input text=$DATA.input.item id="item-$(DATA.input.index)"]
    `
  }

  const splitCodes = (code) =>
  {
    const splitedCode = code.trim().split('\n').map(line =>
    {
      console.log(line)
      return line.trim().split(' ').map(unit => unit.trim())
    })
    return splitedCode
  }
  const splited = splitCodes(DEFINITION.code)

  const parse = (arr, _data) =>
  {
    const DATA = {
      ..._data,
      program: 'html', // default type is HTML render
    }

    flagScope = false
    temp = ''
    previous = undefined

    for (let i = 0; i < arr.length; i++) {
      const line = arr[ i ]
      for (let j = 0; j < line.length; j++) {

        const str = line[ j ]

        counter = 0
        letter_space = 0
        letter = undefined
        program_que = []

        const _DATA = {
          ...DATA,
          program_que,
          code_type: -1,

        }
        generatedWritingCode(str, _DATA, undefined, '', false)

        if (temp === 'type') {
          programType = (type) => genElement(type)
          // programType(type) = genElement(type)
        }
        else if (temp === 'tag') {
          generateDOM = (tag) => programType(tag)
          // generateDOM('ul') = genElement('html')('ul')
        }

      }

    }
    // computeStr

  }

  parse(splited, DATA)
}

const main = async () =>
{
  VIEW = 'view'
  TEST_LIST = new Array(10).fill('example-').map((str, i) => str + (i + 1))
  const view_dom = _id(VIEW)
  view_dom.innerText = VIEW

  Template()
}


main()
