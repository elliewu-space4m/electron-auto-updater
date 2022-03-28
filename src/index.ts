import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';

app.whenReady().then(() => {
  const web = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
    show: false,
  });
  web.once('ready-to-show', () => {
    web.show();
    web.webContents.openDevTools();
  });
  web.loadFile(join(__dirname, 'static/index.html'));

  const check = () => {
    console.log('check for update');
    autoUpdater.checkForUpdatesAndNotify({
      title: 'new version',
      body: 'a new update is available',
    });
  };

  const startDownload = () => {
    autoUpdater.downloadUpdate();
  };

  const quitAndInstall = () => {
    autoUpdater.quitAndInstall();
  };

  autoUpdater.on('update-avaiable', () =>
    web.webContents.send('update-available')
  );

  autoUpdater.on('update-downloaded', () =>
    web.webContents.send('update-downloaded')
  );

  ipcMain.on('start-download', () => startDownload());

  ipcMain.on('quit-and-install', () => quitAndInstall());

  ipcMain.on('app.version', (event) => (event.returnValue = app.getVersion()));

  ipcMain.handle(
    'dialog.message',
    async (_, title: string, message: string, buttons: string[]) =>
      dialog.showMessageBox({
        title,
        message,
        buttons,
      })
  );

  check();
  setInterval(() => check(), 60000);
});
