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
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const fs = require('fs');
const { spawn } = require('child_process');
const Store = require('electron-store');
const store = new Store();
const moment = require('moment');

let tagsBowl;
let configBowl;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('update-alna', async (event, arg) => {
  tagsBowl = store.get('builder-path') + 'tags.bowl';
  fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    let splitArray = data.split('\n');
    for (let i = 0; i < splitArray.length; i++) {
      if (splitArray[i].startsWith('VAR alna')) {
        splitArray[i] = 'VAR alna ' + arg;
        let result = splitArray.join('\n');
        fs.writeFile(tagsBowl, result, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      }
    }
  });
});

ipcMain.on('change-data-tag-value', async (event, arg) => {
  tagsBowl = store.get('builder-path') + 'tags.bowl';
  fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    let splitArray = data.split('\n');
    let dataTagExists = false;
    for (let i = 0; i < splitArray.length; i++) {
      if (splitArray[i].startsWith('VAR datatag')) {
        dataTagExists = true;
        if (arg[2] === '') {
          splitArray[i] = '';
        } else {
          splitArray[i] = 'VAR datatag ' + arg[2];
        }
        let result = splitArray.join('\n');
        fs.writeFile(tagsBowl, result, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      }
    }
    if (!dataTagExists && arg[2] !== '') {
      splitArray.pop();
      splitArray.push('VAR datatag ' + arg[2]);
      let result = splitArray.join('\n');
      fs.writeFile(tagsBowl, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    }
  });
});

ipcMain.on('get-builder-path', async (event, arg) => {
  event.reply('get-builder-path', store.get('builder-path'));
});

ipcMain.on('get-tags', async (event, arg) => {
  tagsBowl = store.get('builder-path') + 'tags.bowl';
  const tags = {};
  fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      event.reply('get-tags', 'no tags');
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
    event.reply('get-tags', tags);
  });
});

ipcMain.on('get-config', async (event, arg) => {
  configBowl = store.get('builder-path') + 'config.bowl';
  const conf = {};
  fs.readFile(configBowl, 'utf8', function (err, data) {
    if (err) {
      event.reply('get-config', 'no config');
      return console.log(err);
    }

    data.split(/\r?\n/).forEach((line) => {
      if (line.startsWith('VAR ')) {
        line = line.substring(4);
        const confKeys = line
          .substring(0, line.indexOf(' ') + 1)
          .replace('tag', '')
          .replace(' ', '');
        const confValues = line
          .substring(line.indexOf(' ') + 1)
          .replaceAll('"', '');
        if (confValues === 'true') {
          conf[confKeys] = true;
        } else if (confValues === 'false') {
          conf[confKeys] = false;
        } else {
          conf[confKeys] = confValues;
        }
      }
      if (line.startsWith('CONST ')) {
        line = line.substring(6);
        const confKeys = line
          .substring(0, line.indexOf(' ') + 1)
          .replace('tag', '')
          .replace(' ', '');
        const confValues = line
          .substring(line.indexOf(' ') + 1)
          .replaceAll('"', '');
        if (confValues === 'true') {
          conf[confKeys] = true;
        } else if (confValues === 'false') {
          conf[confKeys] = false;
        } else {
          conf[confKeys] = confValues;
        }
      }
    });
    event.reply('get-config', conf);
  });
});

ipcMain.on('toggle-config-value', async (event, arg) => {
  configBowl = store.get('builder-path') + 'config.bowl';
  fs.readFile(configBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    const lineToReplace = arg[1] + ' ' + (!arg[0]).toString();
    const replacer = arg[1] + ' ' + arg[0].toString();

    var re = new RegExp(lineToReplace, 'g');

    var result = data.replace(re, replacer);

    fs.writeFile(configBowl, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  event.reply('toggle-config-value', arg[1]);
});

ipcMain.on('toggle-tags-value', async (event, arg) => {
  tagsBowl = store.get('builder-path') + 'tags.bowl';
  fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    const lineToReplace = arg[1] + ' ' + arg[0].toString();
    const replacer = arg[1] + ' ' + arg[2].toString();

    var re = new RegExp(lineToReplace, 'g');

    var result = data.replace(re, replacer);

    fs.writeFile(tagsBowl, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  event.reply('toggle-tags-value', 'Tags changed');
});

ipcMain.on('change-text-tags-value', async (event, arg) => {
  tagsBowl = store.get('builder-path') + 'tags.bowl';
  fs.readFile(tagsBowl, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var lineToReplace;
    var replacer;
    if (arg[1] === 'customerName' || arg[1] === 'customerTag') {
      lineToReplace = arg[1] + ' "' + arg[0] + '"';
      replacer = arg[1] + ' "' + arg[2] + '"';
    } else {
      lineToReplace = arg[1] + ' ' + arg[0];
      replacer = arg[1] + ' ' + arg[2];
    }

    var re = new RegExp(lineToReplace, 'g');

    var result = data.replace(re, replacer);

    fs.writeFile(tagsBowl, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  event.reply('change-text-tags-value', arg);
});

let child = null;

ipcMain.on('run-script', async (event, arg) => {
  var result;
  var log_file = fs.createWriteStream(
    store.get('builder-path') + arg + '_' + moment().format() + '.log',
    { flags: 'w' }
  );
  log_file.write(`${moment().format()} \n`);
  child = spawn('node', [store.get('builder-path') + 'build.js'], {
    cwd: store.get('builder-path'),
    detached: false,
  });
  child.stdout.on('data', (data) => {
    result = 'success';
    mainWindow.webContents.send('output', `${data}`);
    log_file.write(`${data}`);
  });

  child.stderr.on('data', (data) => {
    result = 'error';
    log_file.write(`${data}`);
    mainWindow.webContents.send('output', ` ${data}`);
  });

  child.on('exit', function () {
    event.reply('run-script', result);
    log_file.write(`${moment().format()}`);
    child.stdin.pause();
    child.kill();
  });
});

ipcMain.on('kill-script', (event, data) => {
  child.stdin.pause();
  child.kill();
});

ipcMain.on('open-dialog-builder-path', async (event) => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then((result) => {
      if (result.filePaths.length > 0) {
        store.set('builder-path', result.filePaths + '/');
        event.reply('open-dialog-builder-path', result.filePaths + '/');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on('select-config-path', async (event, arg) => {
  const reply = {
    pathType: arg.pathType,
    path: '',
  };
  configBowl = store.get('builder-path') + 'config.bowl';
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then((result) => {
      reply.path = `${result.filePaths}`;
      if (reply.path !== '') {
        fs.readFile(configBowl, 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }

          const lines = data.split('\n');
          const replacedLines = lines.map((line) => {
            if (line.startsWith(`CONST ${arg.pathType}`)) {
              return `CONST ${arg.pathType} "${reply.path}"`;
            }
            return line;
          });

          const result = replacedLines.join('\n');

          fs.writeFile(configBowl, result, 'utf8', function (err) {
            if (err) return console.log(err);
            event.reply('select-config-path', reply);
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on('backup-tags', async (event, arg) => {
  let options = {
    title: 'Save log file',
    buttonLabel: 'Save',
    properties: ['openDirectory'],
    filters: [{ name: 'Custom File Type', extensions: ['bowl'] }],
  };
  dialog.showSaveDialog(mainWindow, options).then((result) => {
    if (!result.canceled) {
      tagsBowl = store.get('builder-path') + 'tags.bowl';
      fs.copyFile(tagsBowl, result.filePath, (err) => {
        if (err) throw err;
        event.reply('backup-tags', 'Tags backed up');
      });
    }
  });
});

ipcMain.on('load-tags', async (event, arg) => {
  let options = {
    properties: ['openFile'],
    filters: [{ name: 'Custom File Type', extensions: ['bowl'] }],
  };
  dialog.showOpenDialog(mainWindow, options).then((result) => {
    if (!result.canceled) {
      tagsBowl = store.get('builder-path') + 'tags.bowl';
      fs.copyFile(result.filePaths[0], tagsBowl, (err) => {
        if (err) throw err;
        event.reply('load-tags', 'Tags loaded');
      });
    }
  });
});

ipcMain.on('get-clients', async (event, arg) => {
  fs.readFile(
    store.get('builder-path') + 'clientconfig.json',
    'utf8',
    (error, data) => {
      if (error) {
        event.reply('get-clients', 'no clients');
        return;
      }
      event.reply('get-clients', JSON.parse(data).clients);
    }
  );
});

ipcMain.on('change-gpg-sign', async (event, arg) => {
  configBowl = store.get('builder-path') + 'config.bowl';
  let result;
  if (typeof arg !== 'undefined') {
    fs.readFile(configBowl, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      let splitArray = data.split('\n');
      for (let i = 0; i < splitArray.length; i++) {
        if (splitArray[i].startsWith('VAR gpgsign')) {
          splitArray[i] = 'VAR gpgsign ' + arg.gpgSign;
          result = splitArray.join('\n');
        }
        if (splitArray[i].startsWith('VAR gpgpass')) {
          splitArray[i] = 'VAR gpgpass ' + arg.gpgPass;
          result = splitArray.join('\n');
        }
      }
      fs.writeFile(configBowl, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
      event.reply('change-gpg-sign', arg);
    });
  }
});

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
    width: 1280,
    height: 1024,
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
