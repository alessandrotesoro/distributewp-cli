const {
	Command,
	flags
} = require('@oclif/command')

const utilities = require( '../utilities' )

class InitCommand extends Command {
	async run() {
		const {
			flags
		} = this.parse(InitCommand)

		const pluginDirectory = process.cwd()
		const configFile = `${pluginDirectory}/distributewp.json`

		if (  utilities.fileExists( configFile ) ) {
			this.error('This folder has already been configured for deployment. File distributewp.json already exists.')
		} else {

		}

	}
}

InitCommand.description = `Configure deployment from the current folder.
...
Extra documentation goes here
`

module.exports = InitCommand
