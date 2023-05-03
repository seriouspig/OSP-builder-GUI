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
const Store = require('electron-store');
const store = new Store();

if (store.get('builder-path')) {
  console.log(
    '================= BUILDER PATH FROM STORE ========================'
  );
  console.log(store.get('builder-path'));
} else {
  console.log('=============== NO STORE BUILDER PATH ===============');
  console.log(store.get('builder-path'));
}

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

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// ================================ OSP BUILDER GUI START ==================================

ipcMain.on('get-builder-path', async (event, arg) => {
  event.reply('get-builder-path', store.get('builder-path'));
});

// ------ READ THE TAGS.BOWL -------

ipcMain.on('get-tags', async (event, arg) => {
  tagsBowl = store.get('builder-path') + 'tags.bowl';
  console.log(tagsBowl);
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
    console.log(tags);
    event.reply('get-tags', tags);
  });
});

// ------ READ THE CONFIG.BOWL -------

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
    console.log(conf);
    event.reply('get-config', conf);
  });
});

// ------ TOGGLE CONFIG VALUE -------
ipcMain.on('toggle-config-value', async (event, arg) => {
  console.log('=========== CHANGING INTEGRATION =============');
  configBowl = store.get('builder-path') + 'config.bowl';
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
  event.reply('toggle-config-value', arg[1]);
});

ipcMain.on('toggle-tags-value', async (event, arg) => {
  console.log('=========== CHANGING TAGS =============');
  tagsBowl = store.get('builder-path') + 'tags.bowl';
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
  tagsBowl = store.get('builder-path') + 'tags.bowl';
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
    store.get('builder-path') + arg + '.log',
    { flags: 'w' }
  );
  child = spawn('node', [store.get('builder-path') + 'testscript.js'], {
    cwd: store.get('builder-path'),
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
  child.stdin.pause();
  child.kill();
});

ipcMain.on('open-dialog-builder-path', async (event) => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then((result) => {
      console.log(result.filePaths)
      if (result.filePaths.length > 0) {
        var basepath = app.getAppPath();
        console.log(basepath);
        store.set('builder-path', result.filePaths + '/');
        console.log('**********************');
        console.log(result.filePaths + '/');

        event.reply('open-dialog-builder-path', result.filePaths + '/');
        // event.reply('get-builder-path', result.filePaths + '/');
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
      console.log("***********")
      console.log(reply.path)
      if (reply.path !== "") {
              fs.readFile(configBowl, 'utf8', function (err, data) {
                if (err) {
                  return console.log(err);
                }
                console.log(data);
                console.log(arg);

                var lineToReplace = arg.pathType + ' "' + arg.oldPath + '"';
                var replacer = arg.pathType + ' "' + reply.path + '"';

                console.log(lineToReplace);
                console.log(replacer);

                var re = new RegExp(lineToReplace, 'g');

                var result = data.replace(re, replacer);

                fs.writeFile(configBowl, result, 'utf8', function (err) {
                  if (err) return console.log(err);
                  event.reply('select-config-path', reply);
                });
              });
      }


      // event.reply('select-config-path', reply);
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
    console.log(result.filePath);
    tagsBowl = store.get('builder-path') + 'tags.bowl';
    // File destination.txt will be created or overwritten by default.
    fs.copyFile(tagsBowl, result.filePath, (err) => {
      if (err) throw err;
      event.reply('backup-tags', 'Tags backed up');
    });
  });
});

ipcMain.on('load-tags', async (event, arg) => {
  let options = {
    properties: ['openFile'],
    filters: [{ name: 'Custom File Type', extensions: ['bowl'] }],
  };
  dialog.showOpenDialog(mainWindow, options).then((result) => {
    console.log(result.filePaths[0]);
    tagsBowl = store.get('builder-path') + 'tags.bowl';
    // File destination.txt will be created or overwritten by default.
    fs.copyFile(result.filePaths[0], tagsBowl, (err) => {
      if (err) throw err;
      event.reply('load-tags', 'Tags loaded');
    });
  });
});

ipcMain.on('get-clients', async (event, arg) => {
  fs.readFile(
    store.get('builder-path') + 'clientconfig.json',
    'utf8',
    (error, data) => {
      if (error) {
        event.reply('get-clients', "no clients");
        return;
      }
      event.reply('get-clients', JSON.parse(data).clients);
    }
  );
});

ipcMain.on('change-gpg-sign', async (event, arg) => {
  console.log('=========== CHANGING GPG SIGN =============');
  configBowl = store.get('builder-path') + 'config.bowl';
  if (typeof arg !== 'undefined') {
    fs.readFile(configBowl, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      console.log(arg);

      var lineToReplace;
      var replacer = 'gpgsign ' + arg;

      var result;

      if (arg === 'OSP-DOP-SIGN-ENCRYPT-CUSTOMER2') {
        console.log('Should replace application.signing@blueboxaviation.com');
        lineToReplace = 'gpgsign application.signing@blueboxaviation.com';
      } else if (arg === 'application.signing@blueboxaviation.com') {
        console.log('Should replace OSP-DOP-SIGN-ENCRYPT-CUSTOMER2');
        lineToReplace = 'gpgsign OSP-DOP-SIGN-ENCRYPT-CUSTOMER2';
      }

      var re = new RegExp(lineToReplace, 'g');

      var result = data.replace(re, replacer);

      fs.writeFile(configBowl, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
    event.reply('change-gpg-sign', arg);
  }

});

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
