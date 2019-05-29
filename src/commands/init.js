const {
	Command
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer')
const jsonfile = require('jsonfile')
const logSymbols = require('log-symbols')

var questions = [{
		type: 'input',
		name: 'plugin_slug',
		message: "What's the slug of your plugin?",
		validate: function validate(val) {
			return val !== '';
		}
	},
	{
		type: 'input',
		name: 'deployment_folder',
		message: "What's the folder you wish to deploy?",
		validate: function validate(val) {
			return val !== '';
		}
	},
	{
		type: 'confirm',
		name: 'deploy_assets',
		message: "Do you wish to deploy plugin's assets too?",
	},
	{
		type: 'input',
		name: 'assets_folder',
		message: "What's the folder where assets are stored?",
		validate: function validate(val) {
			return val !== '';
		},
		when: function (answers) {
			return answers.deploy_assets;
		}
	}
];

class InitCommand extends Command {
	async run() {

		const pluginDirectory = process.cwd()
		const configFile = `${pluginDirectory}/distributewp.json`

		if (utilities.fileExists(configFile)) {
			this.error('This folder has already been configured for deployment. File distributewp.json already exists.')
		} else {

			await inquirer.prompt(questions).then(answers => {
				jsonfile.writeFileSync(configFile, answers, {
					spaces: 2
				})
			});

			this.log(logSymbols.success, `Configuration file has been successfully created in folder ${pluginDirectory}/distributewp.json`)

		}

	}
}

InitCommand.description = `Configure deployment from the current folder.
...
Extra documentation goes here
`

module.exports = InitCommand
