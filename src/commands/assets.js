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

			var data = jsonfile.readFileSync(configFile)

			if ( data.deploy_assets === true && data.assets_folder ) {

				const assetsFolder = `${pluginDirectory}/${data.assets_folder}`

				if ( utilities.dirExists( assetsFolder ) ) {
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
								{
									title: 'Cleaning up SVN repository...',
									task: ( ctx, task ) => {

										return new Observable(observer => {

											svnUltimate.commands.del( 'assets',
											{
												trustServerCert: true,
												username: username,
												password: password,
												cwd: tempSVNFolder,		// override working directory command is executed
												quiet: true,			// provide --quiet to commands that accept it
												force: true,			// provide --force to commands that accept it
											},
											function( err ) {

												if ( err ) {
													throw new Error( 'Something went wrong while cleaning up assets directory.' );
												} else {
													task.title = 'Successfully cleaned up SVN assets directory'
													observer.complete();
												}

											} );

										} );

									}
								},
								{
									title: 'Copying new assets...',
									task: ( ctx, task ) => {

										fs.copySync( assetsFolder, `${tempSVNFolder}/assets` )

										task.title = 'Successfully added new assets'

									}
								},
								{
									title: 'Adding files to SVN repository...',
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

										} );

									}
								},
								{
									title: 'Committing files to .org repository...',
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
														fs.removeSync( tempSVNFolder )
														task.title = 'Commit complete'
														observer.complete();
													}
												}
											);

										} );

									}
								},
							]);

							tasks.run().then( () => {

								this.log( ' ' )
								this.log( logSymbols.success, `Assets files on .org have been successfully updated.` )
								this.log( ' ' )

							}).catch( err => {
								this.error( err )
							} );

						} else {
							this.error( 'Deployment aborted.' )
						}

					});

				} else {

					this.error( `Could not find the assets folder at ${assetsFolder}.` )

				}

			} else {

				this.error( 'This plugin was not configured for assets deployment. Delete the distributewp.json file and run distribute-wp init to configure the plugin for assets deployment.')

			}

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
