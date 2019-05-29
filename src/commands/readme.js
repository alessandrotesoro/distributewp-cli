const {
	Command
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer')
const logSymbols = require('log-symbols')
const jsonfile = require('jsonfile')
const execa = require('execa');
const Listr = require('listr');
const {Observable} = require('rxjs');
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
		const configFile = `${pluginDirectory}/distributewp.json`

		if ( utilities.fileExists(readmeFile) && utilities.fileExists(configFile) ) {

			await inquirer.prompt(allQuestions).then(answers => {

				if (answers.confirm === true) {

					var data = jsonfile.readFileSync(configFile)

					const username = answers.username
					const password = answers.password
					const pluginSlug = data.plugin_slug
					const svnUrl = `https://plugins.svn.wordpress.org/${pluginSlug}`

				}

			});

		} else {

			this.error('No readme.txt or config file has been found in this folder.')

		}

	}
}

ReadmeCommand.description = `Update the readme.txt file on WordPress.org with the one in the current working directory.
...
Extra documentation goes here
`

module.exports = ReadmeCommand
