const {
	Command
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer')
const jsonfile = require('jsonfile')
const logSymbols = require('log-symbols')
const Listr = require('listr');
const fs = require('fs-extra')
const path = require('path')
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
					const newVersion = answers.version
					const pluginSlug = data.plugin_slug
					const svnUrl = `https://plugins.svn.wordpress.org/${pluginSlug}`
					const tempSVNFolder = `${pluginDirectory}/tempsvn`
					const deploymentFolder = `${pluginDirectory}/${data.deployment_folder}`
					const newTagDestFolder = `${tempSVNFolder}/tags/${newVersion}`

					if ( ! utilities.dirExists( deploymentFolder ) ){
						this.error( `The deployment folder at ${deploymentFolder} could not be found.` )
					}

					const tasks = new Listr([
						{
							title: 'Checking out .org repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.checkout( svnUrl, tempSVNFolder.replace(/(\s+)/g, '\\$1'), {
										depth: "immediates",
									}, function( err ) {
										if ( ! err ) {
											task.title = 'Successfully checked out .org repository'
											observer.complete();
										}
									} );

								});

							}
						},
						{
							title: 'Creating new tag for the release...',
							task: ( ctx, task ) => {

								fs.copySync( deploymentFolder, newTagDestFolder )

								task.title = 'Successfully created new tag folder'

							}
						},
						{
							title: 'Adding new tag to .org repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.add( '.',
										{
											trustServerCert: true,
											cwd: tempSVNFolder,		// override working directory command is executed
											quiet: true,			// provide --quiet to commands that accept it
											force: true,			// provide --force to commands that accept it
										},
										function( err ) {
											if ( err ) {
												throw new Error( 'Something went wrong while adding files.' );
											} else {
												task.title = 'Successfully added all files to SVN repository'
												observer.complete();
											}
										} );

								});

							}
						},
						{
							title: 'Committing tag to .org repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.commit( null,
										{
											trustServerCert: true,
											username: username,
											password: password,
											cwd: tempSVNFolder,
											quiet: true,
											params: [ '-m "Deployed with distributewp-cli" --no-auth-cache --non-interactive' ]
										},
										( err ) => {
											if ( err ) {
												throw new Error( err );
											} else {
												task.title = 'Commit complete'
												observer.complete();
											}
										}
									);

								});

							}
						},
						{
							title: 'Deleting old trunk folder from .org repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.del( `${svnUrl}/trunk/`,
										{
											trustServerCert: true,
											username: username,
											password: password,
											cwd: tempSVNFolder,
											quiet: true,
											params: [ '-m "Deployed with distributewp-cli" --no-auth-cache --non-interactive' ]
										},
										( err ) => {
											if ( err ) {
												throw new Error( err );
											} else {
												task.title = 'Deleted old trunk folder'
												observer.complete();
											}
										}
									);

								});

							}
						},
						{
							title: 'Creating new trunk folder for the .org repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.copy( `${svnUrl}/tags/${newVersion}`, `${svnUrl}/trunk/`,
										{
											trustServerCert: true,
											username: username,
											password: password,
											cwd: tempSVNFolder,
											quiet: true,
											params: [ '-m "Deployed with distributewp-cli" --no-auth-cache --non-interactive' ]
										},
										( err ) => {
											if ( err ) {
												throw new Error( err );
											} else {
												fs.removeSync( tempSVNFolder )
												task.title = 'Successfully updated the trunk folder'
												observer.complete();
											}
										}
									);

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
`

module.exports = DeployCommand
