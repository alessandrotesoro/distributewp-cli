const {
	Command
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer')
const jsonfile = require('jsonfile')
const logSymbols = require('log-symbols')
const Listr = require('listr');
const fs = require('fs-extra')
const {
	Observable
} = require('rxjs');

var svnUltimate = require('node-svn-ultimate');

const svnQuestions = require('../common-questions')

var questions = [
	{
		type: 'confirm',
		name: 'confirm',
		message: "Are you sure you want to release a new version on WordPress.org?",
	},
	{
		type: 'input',
		name: 'version',
		message: "Enter new version number:",
		validate: function validate(val) {
			return val !== '';
		}
	},
];

const allQuestions = questions.concat(svnQuestions)

class DeployCommand extends Command {
	async run() {

		const pluginDirectory = process.cwd()
		const configFile = `${pluginDirectory}/distributewp.json`

		if ( utilities.fileExists(configFile) ) {

			const results = await inquirer.prompt(allQuestions).then(answers => {

			});

		} else {
			this.error( 'No config file has been found in this folder. Please run distribute-wp init to configure this folder for deployment.')
		}

	}
}

DeployCommand.description = `Release a new version of a WordPress plugin.
...
Extra documentation goes here
`

module.exports = DeployCommand
