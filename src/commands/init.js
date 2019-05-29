const {
	Command,
	flags
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer');

var questions = [{
		type: 'input',
		name: 'plugin_slug',
		message: "What's the slug of your plugin?"
	},
	{
		type: 'input',
		name: 'deployment_folder',
		message: "What's the folder you wish to deploy?",
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
		when: function (answers) {
			return answers.deploy_assets;
		}
	}
];

class InitCommand extends Command {
	async run() {
		const {
			flags
		} = this.parse(InitCommand)

		const pluginDirectory = process.cwd()
		const configFile = `${pluginDirectory}/distributewp.json`

		if (utilities.fileExists(configFile)) {
			this.error('This folder has already been configured for deployment. File distributewp.json already exists.')
		} else {

			await inquirer.prompt(questions).then(answers => {
				console.log(JSON.stringify(answers, null, '  '));
			});

		}

	}
}

InitCommand.description = `Configure deployment from the current folder.
...
Extra documentation goes here
`

module.exports = InitCommand
