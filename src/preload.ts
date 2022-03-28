import { ipcRenderer } from 'electron';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('version')!.innerText =
    ipcRenderer.sendSync('app.version');

  ipcRenderer
    .on('update-available', async () => {
      const confirm =
        (await ipcRenderer.invoke(
          'dialog.message',
          'Update Available',
          'Do you want to download the new version?',
          ['Yes', 'No']
        )) === 0;
      if (confirm) {
        ipcRenderer.send('start-download');
      }
    })
    .on('update-downloaded', async () => {
      const confirm =
        (await ipcRenderer.invoke(
          'dialog.message',
          'Update Downloaded',
          'Do you want to quit the app and install the new version?',
          ['Yes', 'No']
        )) === 0;
      if (confirm) {
        ipcRenderer.send('quit-and-install');
      }
    });
});
