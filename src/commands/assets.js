const {
	Command
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer')
const jsonfile = require('jsonfile')
const logSymbols = require('log-symbols')

const svnQuestions = require('../common-questions')

var questions = [{
	type: 'confirm',
	name: 'confirm',
	message: "Are you sure you want to update the assets files on WordPress.org?",
}];

const allQuestions = questions.concat(svnQuestions)

class AssetsCommand extends Command {
	async run() {

		const pluginDirectory = process.cwd()
		const configFile = `${pluginDirectory}/distributewp.json`

		if ( utilities.fileExists(configFile) ) {

		} else {

			this.error( 'No config file has been found in this folder. Please run distribute-wp init to configure this folder for deployment.')

		}

	}
}

AssetsCommand.description = `Updates the plugin's assets on WordPress.org.
...
Extra documentation goes here
`

module.exports = AssetsCommand
