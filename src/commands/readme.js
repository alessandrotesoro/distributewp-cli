const {
	Command
} = require('@oclif/command')

const utilities = require('../utilities')
const inquirer = require('inquirer')
const logSymbols = require('log-symbols')
const jsonfile = require('jsonfile')
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
	message: "Are you sure you want to update the readme.txt file on WordPress.org?",
}];

const allQuestions = questions.concat(svnQuestions)

class ReadmeCommand extends Command {
	async run() {

		const pluginDirectory = process.cwd()
		const readmeFile = `${pluginDirectory}/readme.txt`
		const configFile = `${pluginDirectory}/distributewp.json`

		if (utilities.fileExists(readmeFile) && utilities.fileExists(configFile)) {

			const results = await inquirer.prompt(allQuestions).then(answers => {

				if (answers.confirm === true) {

					var data = jsonfile.readFileSync(configFile)

					const username = answers.username
					const password = answers.password
					const pluginSlug = data.plugin_slug
					const svnUrl = `https://plugins.svn.wordpress.org/${pluginSlug}`
					const tempSVNFolder = `${pluginDirectory}/tempsvn`

					const tasks = new Listr([
						{
							title: 'Creating temporary SVN folder...',
							task: ( ctx, task ) => {

								utilities.createTempFolder( tempSVNFolder, task )

							}
						},
						{
							title: 'Checking out .org repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.checkout( svnUrl, tempSVNFolder, {
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
							title: 'Removing previous readme.txt file from trunk...',
							task: ( ctx, task ) => {

								fs.removeSync( `${tempSVNFolder}/trunk/readme.txt` )

								task.title = 'Successfully removed previous readme.txt file from trunk'

							}
						},
						{
							title: 'Copying new readme.txt file into trunk...',
							task: ( ctx, task ) => {

								fs.copySync( readmeFile, `${tempSVNFolder}/trunk/readme.txt` )

								task.title = 'Successfully copied new readme.txt into trunk'

							}
						},
						{
							title: 'Updating readme.txt file in latest tag...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.util.getLatestTag( `${tempSVNFolder}/trunk`, function( err, latestTag ) {

										if ( err ) {
											throw new Error( 'Something went wrong while detecting the latest tag.' );
										} else {

											svnUltimate.commands.update( `${tempSVNFolder}/tags/${latestTag.name}`,
											{
												username: username,
												password: password,
												params: [ '--set-depth infinity trunk' ],
											},
											function( err ) {

												if ( err ) {
													throw new Error( 'Something went wrong while updating the latest tag.' );
												} else {
													fs.copySync( readmeFile, `${tempSVNFolder}/tags/${latestTag.name}/readme.txt` )
												}

												observer.complete();

												task.title = 'Successfully updated readme.txt in latest tag'

											} );
										}

									} );

								});

							}
						},
						{
							title: 'Adding files to SVN repository...',
							task: ( ctx, task ) => {

								return new Observable(observer => {

									svnUltimate.commands.add( '.',
									{
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
						this.log( logSymbols.success, `readme.txt file on .org has been successfully updated.` )
						this.log( ' ' )

					}).catch( err => {
						this.error( err )
					} );

				}

			});

		} else {

			this.error( 'No readme.txt or config file has been found in this folder.')

		}

	}
}

ReadmeCommand.description = `Updates the readme.txt file on WordPress.org.
...
Extra documentation goes here
`

module.exports = ReadmeCommand
