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
		},
		when: function (answers) {
			return answers.confirm;
		}
	},
];

const allQuestions = questions.concat(svnQuestions)

class DeployCommand extends Command {
	async run() {

		const pluginDirectory = process.cwd()
		const configFile = `${pluginDirectory}/distributewp.json`

		if ( utilities.fileExists(configFile) ) {

			var data = jsonfile.readFileSync(configFile)

			const results = await inquirer.prompt(allQuestions).then(answers => {

				if (answers.confirm === true) {

					const username = answers.username
					const password = answers.password
					const pluginSlug = data.plugin_slug
					const svnUrl = `https://plugins.svn.wordpress.org/${pluginSlug}`
					const tempSVNFolder = `${pluginDirectory}/tempsvn`

					const tasks = new Listr([
						{
							title: 'Checking out .org repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.checkout( svnUrl, tempSVNFolder, {
										trustServerCert: true,
										depth: "immediates",
									}, function( err ) {
										if ( ! err ) {
											svnUltimate.commands.update( tempSVNFolder,
											{
												username: username,
												password: password,
												params: [ '--set-depth infinity trunk' ],
											},
											function( err ) {
												if ( ! err ) {
													task.title = 'Successfully checked out .org repository'
													observer.complete();
												} else {
													throw new Error( 'Something went wrong while checking out the .org repository.' );
												}
											} );
										}
									} );

								});

							}
						},
					]);

					tasks.run().then( () => {

						this.log( ' ' )
						this.log( logSymbols.success, `New version successfully deployed.` )
						this.log( ' ' )

					}).catch( err => {
						this.error( err )
					} );

				} else {
					this.error( 'Deployment aborted.' )
				}

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
