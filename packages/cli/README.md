User Story Book CLI
=================

Generate a static site to navigate and review your business logic.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @userstorybook/cli
$ usb COMMAND
running command...
$ usb (--version)
@userstorybook/cli/0.0.1 darwin-arm64 node-v18.8.0
$ usb --help [COMMAND]
USAGE
  $ usb COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`usb build [FILE]`](#usb-build-file)
* [`usb help [COMMAND]`](#usb-help-command)
* [`usb plugins`](#usb-plugins)
* [`usb plugins:install PLUGIN...`](#usb-pluginsinstall-plugin)
* [`usb plugins:inspect PLUGIN...`](#usb-pluginsinspect-plugin)
* [`usb plugins:install PLUGIN...`](#usb-pluginsinstall-plugin-1)
* [`usb plugins:link PLUGIN`](#usb-pluginslink-plugin)
* [`usb plugins:uninstall PLUGIN...`](#usb-pluginsuninstall-plugin)
* [`usb plugins:uninstall PLUGIN...`](#usb-pluginsuninstall-plugin-1)
* [`usb plugins:uninstall PLUGIN...`](#usb-pluginsuninstall-plugin-2)
* [`usb plugins update`](#usb-plugins-update)

## `usb build [FILE]`

Builds your user storybook according to your configuration.

```
USAGE
  $ usb build [FILE] [-c <value>] [-o <value>] [-f] [-v]

FLAGS
  -c, --config=<value>  [default: .userstorybook.json] Path to configuration file
  -f, --force
  -o, --output=<value>  [default: .userstorybook] Path to storybook output directory
  -v, --verbose

DESCRIPTION
  Builds your user storybook according to your configuration.

EXAMPLES
  $ usb build
```

_See code: [dist/commands/build.ts](https://github.com/wcatron/userstorybook/blob/v0.0.1/dist/commands/build.ts)_

## `usb help [COMMAND]`

Display help for usb.

```
USAGE
  $ usb help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for usb.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `usb plugins`

List installed plugins.

```
USAGE
  $ usb plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ usb plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `usb plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ usb plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ usb plugins add

EXAMPLES
  $ usb plugins:install myplugin 

  $ usb plugins:install https://github.com/someuser/someplugin

  $ usb plugins:install someuser/someplugin
```

## `usb plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ usb plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ usb plugins:inspect myplugin
```

## `usb plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ usb plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ usb plugins add

EXAMPLES
  $ usb plugins:install myplugin 

  $ usb plugins:install https://github.com/someuser/someplugin

  $ usb plugins:install someuser/someplugin
```

## `usb plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ usb plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ usb plugins:link myplugin
```

## `usb plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ usb plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ usb plugins unlink
  $ usb plugins remove
```

## `usb plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ usb plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ usb plugins unlink
  $ usb plugins remove
```

## `usb plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ usb plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ usb plugins unlink
  $ usb plugins remove
```

## `usb plugins update`

Update installed plugins.

```
USAGE
  $ usb plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
