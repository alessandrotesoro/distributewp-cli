distributewp-cli
================

Command line interface that helps with the deployment of plugins on WordPress.org

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/distributewp-cli.svg)](https://npmjs.org/package/distributewp-cli)
[![Downloads/week](https://img.shields.io/npm/dw/distributewp-cli.svg)](https://npmjs.org/package/distributewp-cli)
[![License](https://img.shields.io/npm/l/distributewp-cli.svg)](https://github.com/alessandrotesoro/distributewp-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g distributewp-cli
$ distribute-wp COMMAND
running command...
$ distribute-wp (-v|--version|version)
distributewp-cli/0.1.0 darwin-x64 node-v10.13.0
$ distribute-wp --help [COMMAND]
USAGE
  $ distribute-wp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`distribute-wp assets`](#distribute-wp-assets)
* [`distribute-wp help [COMMAND]`](#distribute-wp-help-command)
* [`distribute-wp init`](#distribute-wp-init)
* [`distribute-wp readme`](#distribute-wp-readme)

## `distribute-wp assets`

Updates the plugin's assets on WordPress.org.

```
USAGE
  $ distribute-wp assets

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/assets.js](https://github.com/alessandrotesoro/distributewp-cli/blob/v0.1.0/src/commands/assets.js)_

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

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/init.js](https://github.com/alessandrotesoro/distributewp-cli/blob/v0.1.0/src/commands/init.js)_

## `distribute-wp readme`

Updates the readme.txt file on WordPress.org.

```
USAGE
  $ distribute-wp readme

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/readme.js](https://github.com/alessandrotesoro/distributewp-cli/blob/v0.1.0/src/commands/readme.js)_
<!-- commandsstop -->
