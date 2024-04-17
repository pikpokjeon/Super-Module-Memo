background = document.getElementsByTagName('body')[ 0 ]

plus = document.createElement('button')
minus = document.createElement('button')

background.prepend(plus, minus)

plus.innerText = 'plus'
minus.innerText = 'minus'

counter = document.createElement('div')
counter.setAttribute('id', 'number')
counter.innerText = 2

background.prepend(counter)

const counterValue = async () => document.getElementById('number')

CONDITION = (number) => number > -1 && number <= 5

const changeNodeText = async (node, number) =>
{
    valueNode = await counterValue()
    current = Number(valueNode.innerText.trim())
    if (node) {
        node.innerText = number
    } else return await changeNodeText(await counterValue(), number)
    console.log(current, number)
    return ({ current, number })
}
const changeNumber = async (add) =>
{
    valueNode = await counterValue()
    currentCount = Number(valueNode.innerText.trim())
    changedNumber = (currentCount + add)
    return await changeNodeText(valueNode, changedNumber)

}
const Counter = async ({ current, number }) =>
{
    gap = Number(-(current - number))
    console.log(gap)
    if (CONDITION(number)) return true
    return await changeNumber(-gap)

}

const Action = async (add) =>
{
    const value = await changeNumber(add)
    return await Counter(value)
}
plus.addEventListener('click', async (e) => await Action(1))
minus.addEventListener('click', async (e) => await Action(-1))
