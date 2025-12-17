# Parcours Forms

## Installation

```bash
  git clone https://github.com/RyanNeTwAllianz/Recette_Automatisee
```

```bash
    cd Recette_Automatisee
```

```bash
    npm i
```

```bash
    npm run build
```

```bash
    npm run setup
```

```bash
    npm run start
```

Example :

```bash
    npm run sart _bash auto
```

## ENUMS

### Commands

| Parameter       | Description                       |
| :-------------- | :-------------------------------- |
| Commands.SCRIPT | Execute script in browser console |
| Commands.CUSTOM | Execute script in project         |
| Commands.CLICK  | Click on element                  |
| Commands.TYPE   | Type on input                     |

### Plugins

| Parameter          | Description                |
| :----------------- | :------------------------- |
| Plugins.SCREENSHOT | Take screenshots           |
| Plugins.RED        | Outline element in red     |
| Plugins.PDF        | Generate Pdf               |
| Plugins.HTML       | Generate HTML              |
| Plugins.CONSOLE    | Generate console logs file |
| Plugins.NETWORK    | Return network logs file   |
| Plugins.TRACKING   | Return tracking logs file  |

## TYPES

### Bash : BashType

| Parameter       | Type          | Description                           |
| :-------------- | :------------ | :------------------------------------ |
| testsNameSuffix | string        | Suffixe                               |
| reloadBrowser   | boolean       | Reload browser after exectuing        |
| closeWindow     | boolean       | Close window at the end               |
| cookies         | string[]      | Threats number                        |
| blockedUrls     | string[]      | Urls to block                         |
| urlParams       | string        | Urls params                           |
| plugins         | Plugins[]     | Plugins                               |
| doBefore        | CommandType[] | Commands to execute before every file |
| doAfter         | CommandType[] | Commands to execute after every file  |
| tests           | string[]      | List of files                         |

### File : ProcessType

| Parameter   | Type                        | Description             |
| :---------- | :-------------------------- | :---------------------- |
| url         | string                      | Url                     |
| closeWindow | boolean                     | Close window at the end |
| plugins     | Plugins[]                   | Plugins                 |
| cookies     | string[]                    | Threats number          |
| blockedUrls | string[]                    | Urls to block           |
| tests       | {commands: CommandType[]}[] | Commands to execute     |

## EXPLICATIONS

