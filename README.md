distributewp-cli
================

Command line interface that helps with the deployment of plugins on WordPress.org

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/distributewp-cli.svg)](https://npmjs.org/package/distributewp-cli)
[![Downloads/week](https://img.shields.io/npm/dw/distributewp-cli.svg)](https://npmjs.org/package/distributewp-cli)
[![License](https://img.shields.io/npm/l/distributewp-cli.svg)](https://github.com/alessandrotesoro/distributewp-cli/blob/master/package.json)

<!-- toc -->
* [How it works](#how-it-works)
* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# How it works

DistributeWP deploys files and folders on your computer to the WordPress.org plugin's SVN repository. With this tool you can release new versions of plugins, update only the assets folder or update only the readme.txt file.

DistributeWP requires .json file in your plugin's folder which contains all the settings required for deployment. This file can be created by running command `distribute-wp init` once you've answered a few questions, the configuration file will be automatically created for you.

The CLI will ask you the following questions:

- What's the slug of your plugin?
- What's the folder you wish to deploy?
- Do you wish to deploy plugin's assets too?
- What's the folder where assets are stored?

Deployment of new releases works by uploading the content of the folder you've specified when answering the 2nd configuration question.

# Requirements

- SVN on your computer.
- Preapproved plugin on wordpress.org
- Node.js

# Installation

```sh-session
npm install -g distributewp-cli
```

# Usage
<!-- usage -->
```sh-session
$ npm install -g distributewp-cli
$ distribute-wp COMMAND
running command...
$ distribute-wp (-v|--version|version)
distributewp-cli/0.1.1 darwin-x64 node-v12.8.1
$ distribute-wp --help [COMMAND]
USAGE
  $ distribute-wp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`distribute-wp assets`](#distribute-wp-assets)
* [`distribute-wp deploy`](#distribute-wp-deploy)
* [`distribute-wp help [COMMAND]`](#distribute-wp-help-command)
* [`distribute-wp init`](#distribute-wp-init)
* [`distribute-wp readme`](#distribute-wp-readme)

## `distribute-wp assets`

Updates the plugin's assets on WordPress.org.

```
USAGE
  $ distribute-wp assets
```

_See code: [src/commands/assets.js](https://github.com/alessandrotesoro/distributewp-cli/blob/v0.1.1/src/commands/assets.js)_

## `distribute-wp deploy`

Release a new version of a WordPress plugin.

```
USAGE
  $ distribute-wp deploy
```

_See code: [src/commands/deploy.js](https://github.com/alessandrotesoro/distributewp-cli/blob/v0.1.1/src/commands/deploy.js)_

## `distribute-wp help [COMMAND]`

display help for distribute-wp

```
USAGE
  $ distribute-wp help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `distribute-wp init`

Configure deployment from the current folder.

```
USAGE
  $ distribute-wp init
```

_See code: [src/commands/init.js](https://github.com/alessandrotesoro/distributewp-cli/blob/v0.1.1/src/commands/init.js)_

## `distribute-wp readme`

Updates the readme.txt file on WordPress.org.

```
USAGE
  $ distribute-wp readme
```

_See code: [src/commands/readme.js](https://github.com/alessandrotesoro/distributewp-cli/blob/v0.1.1/src/commands/readme.js)_
<!-- commandsstop -->
