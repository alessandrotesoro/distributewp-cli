const {
	Command
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer')
const logSymbols = require('log-symbols')
const svnQuestions = require('../common-questions')

var questions = [{
	type: 'confirm',
	name: 'confirm',
	message: "Are you sure you want to update the readme.txt file on WordPress.org?",
} ];

const allQuestions = questions.concat(svnQuestions)

class ReadmeCommand extends Command {
	async run() {

		const pluginDirectory = process.cwd()
		const readmeFile = `${pluginDirectory}/readme.txt`

		if (utilities.fileExists(readmeFile)) {

			await inquirer.prompt(allQuestions).then(answers => {

				if (answers.confirm === true) {

				}

			});

		} else {

			this.error('No readme.txt file has been found in this folder.')

		}

	}
}

ReadmeCommand.description = `Update the readme.txt file on WordPress.org with the one in the current working directory.
...
Extra documentation goes here
`

module.exports = ReadmeCommand
