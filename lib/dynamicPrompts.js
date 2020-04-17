const { journalList, entryList, gap } = require('./prompts')

// ----- ----- Creates journal List

function journalPromptConstructor (journals) {
  entryList[0].choices = []
  journals.forEach((journal) => {
    journalList[0].choices.push(`${journal.name}`)
    journalList[0].choices.push(gap)
  })
  journalList[0].choices.push('START MENU', gap)
  journalList[0].choices.push('EXIT', gap)
}

// ----- ----- Creates List for Display All

function entryPromptConstructor (entries) {
  const choices = [...entryList]
  choices[0].choices = []
  entries.forEach((entry) => {
    const date = new Date(entry.date)
    choices[0].choices.push(`${date.toLocaleString()} | Category: ${entry.category} | Text: ${entry.text.slice(0, 15)}${entry.text.length > 15 ? '...' : ''} | ID: ${entry._id}`)
    choices[0].choices.push(gap)
  })
  choices[0].choices.push('START MENU', gap)
  choices[0].choices.push('EXIT', gap)
  return choices
}

function constructPrompt (data) {
  // what is choices.
  // how to decide which prompt template to use.. what is promptTemplate
  const promptTemplate =
  data.forEach((entry) => {
    promptTemplate[0].choices.push(`${entry.date} ${entry.category} ${entry._id}`)
    promptTemplate[0].choices.push(gap)
  })
  promptTemplate[0].choices.push('START MENU', gap)
  promptTemplate[0].choices.push('EXIT', gap)
  // some array
}

module.exports = {
  journalPromptConstructor,
  entryPromptConstructor
}
