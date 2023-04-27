/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  ipcRenderer,
  dialog,
  remote,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import config from './../builderConfig';

const fs = require('fs');
var childProcess = require('child_process');
const { spawn } = require('child_process');
var util = require('util');

fs.readFile('../settings', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log("============================ START =========================")
  console.log(data.replace('builderPath: ', ''));
  config.builderPath = data.replace('builderPath: ', '');
  console.log(config.builderPath)
});

let tagsBowl
let configBowl;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// ================================ OSP BUILDER GUI START ==================================

ipcMain.on('get-builder-path', async (event, arg) => {
  event.reply('get-builder-path', config.builderPath);
});

// ------ READ THE TAGS.BOWL -------
// ipcMain.on('get-tags', async (event, arg) => {
//   tagsBowl = config.builderPath + 'tags.bowl';
//   console.log(tagsBowl)
//   const tags = {};
//   const allFileContents = fs.readFileSync(tagsBowl, 'utf-8');
//   allFileContents.split(/\r?\n/).forEach((line) => {
//     if (line.startsWith('VAR ')) {
//       line = line.substring(4);
//       const tagKeys = line
//         .substring(0, line.indexOf(' ') + 1)
//         .replace('tag', '')
//         .replace(' ', '');
//       const tagValues = line
//         .substring(line.indexOf(' ') + 1)
//         .replaceAll('"', '');
//       tags[tagKeys] = tagValues;
//     }
//   });
//   event.reply('get-tags', tags);
// });

ipcMain.on('get-tags', async (event, arg) => {
  tagsBowl = config.builderPath + 'tags.bowl';
  console.log(tagsBowl);
  const tags = {};
    fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      event.reply('get-tags', "no tags");
      return console.log(err);
    }

    data.split(/\r?\n/).forEach((line) => {
      if (line.startsWith('VAR ')) {
        line = line.substring(4);
        const tagKeys = line
          .substring(0, line.indexOf(' ') + 1)
          .replace('tag', '')
          .replace(' ', '');
        const tagValues = line
          .substring(line.indexOf(' ') + 1)
          .replaceAll('"', '');
        tags[tagKeys] = tagValues;
      }
    });
    console.log(tags)
    event.reply('get-tags', tags);
  })
})


// ------ READ THE CONFIG.BOWL -------
ipcMain.on('get-config', async (event, arg) => {
  configBowl = config.builderPath + 'config.bowl';
  const tags = {};
  const allFileContents = fs.readFileSync(configBowl, 'utf-8');
  allFileContents.split(/\r?\n/).forEach((line) => {
    if (line.startsWith('VAR ')) {
      line = line.substring(4);
      const tagKeys = line
        .substring(0, line.indexOf(' ') + 1)
        .replace('tag', '')
        .replace(' ', '');
      const tagValues = line
        .substring(line.indexOf(' ') + 1)
        .replaceAll('"', '');
      if (tagValues === 'true') {
        tags[tagKeys] = true;
      } else if (tagValues === 'false') {
        tags[tagKeys] = false;
      } else {
        tags[tagKeys] = tagValues;
      }
    }
    if (line.startsWith('CONST ')) {
      line = line.substring(6);
      const tagKeys = line
        .substring(0, line.indexOf(' ') + 1)
        .replace('tag', '')
        .replace(' ', '');
      const tagValues = line
        .substring(line.indexOf(' ') + 1)
        .replaceAll('"', '');
      if (tagValues === 'true') {
        tags[tagKeys] = true;
      } else if (tagValues === 'false') {
        tags[tagKeys] = false;
      } else {
        tags[tagKeys] = tagValues;
      }
    }
  });
  // tags.testValue = true
  event.reply('get-config', tags);
});

// ------ READ THE TAGS.BOWL -------
ipcMain.on('toggle-config-value', async (event, arg) => {
  console.log('=========== CHANGING INTEGRATION =============');
  fs.readFile(configBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    console.log(arg);
    console.log(arg[1] + ' ' + arg[0].toString());
    const lineToReplace = arg[1] + ' ' + (!arg[0]).toString();
    const replacer = arg[1] + ' ' + arg[0].toString();

    console.log(lineToReplace);
    console.log(replacer);

    var re = new RegExp(lineToReplace, 'g');

    var result = data.replace(re, replacer);

    fs.writeFile(configBowl, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  event.reply('toggle-config-value', 'Integration changed');
});

ipcMain.on('toggle-tags-value', async (event, arg) => {
  console.log('=========== CHANGING TAGS =============');
  fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    console.log(arg);
    console.log(arg[1] + ' ' + arg[0].toString());
    const lineToReplace = arg[1] + ' ' + arg[0].toString();
    const replacer = arg[1] + ' ' + arg[2].toString();

    console.log(lineToReplace);
    console.log(replacer);

    var re = new RegExp(lineToReplace, 'g');

    var result = data.replace(re, replacer);

    fs.writeFile(tagsBowl, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  event.reply('toggle-tags-value', 'Tags changed');
});

ipcMain.on('change-text-tags-value', async (event, arg) => {
  console.log('=========== CHANGING TAGS TEXT =============');
  fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    console.log(arg);

    var lineToReplace;
    var replacer;
    if (arg[1] === 'customerName' || arg[1] === 'customerTag') {
      lineToReplace = arg[1] + ' "' + arg[0] + '"';
      replacer = arg[1] + ' "' + arg[2] + '"';
    } else {
      lineToReplace = arg[1] + ' ' + arg[0];
      replacer = arg[1] + ' ' + arg[2];
    }

    console.log(lineToReplace);
    console.log(replacer);

    var re = new RegExp(lineToReplace, 'g');

    var result = data.replace(re, replacer);

    fs.writeFile(tagsBowl, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  event.reply('change-text-tags-value', arg);
});

// ------ RUN BUILD SCRIPT -------
let child = null;

ipcMain.on('run-script', async (event, arg) => {
  var log_file = fs.createWriteStream(
    config.builderPath + 'testscriptlog.log',
    { flags: 'w' }
  );
  child = spawn('node', [config.builderPath + 'testscript.js'], {
    cwd: config.builderPath,
    detached: false,
  });
  child.stdout.on('data', (data) => {
    console.log(`child stdout: ${data}`);
    // event.sender.send('start-logging', 'Start logging');
    mainWindow.webContents.send('output', `${data}`);
    log_file.write(data);
  });

  child.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
  });

  process.on('exit', function () {
    child.stdin.pause();
    child.kill();
  });
});

ipcMain.on('kill-script', (event, data) => {
  // kill(child.pid, 'SIGKILL');
  child.stdin.pause();
  child.kill();
});

ipcMain.on('open-dialog-builder-path', async (event) => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then((result) => {
      var basepath = app.getAppPath();
      console.log(basepath);
      updateConfigFile(result.filePaths[0] + '/');

      event.reply('open-dialog-builder-path', result.filePaths + '/');
      event.reply('get-builder-path', result.filePaths + '/');
    })
    .catch((err) => {
      console.log(err); 
    });
});

const updateConfigFile = (newPath) => {
  console.log('Updating Config File');
  fs.readFile('../settings', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);

    var lineToReplace = 'builderPath: ' + config.builderPath;
    var replacer = 'builderPath: ' + newPath;

    console.log(lineToReplace);
    console.log(replacer);

    var re = new RegExp(lineToReplace, 'g');

    var result = data.replace(re, replacer);

    fs.writeFile('../settings', result, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log(newPath)
      config.builderPath = newPath;
      console.log(config.builderPath)
    });
  });
};

// ================================ OSP BUILDER GUI END ====================================

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
