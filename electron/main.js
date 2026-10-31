import { app, BrowserWindow, dialog, net, protocol } from 'electron';
import updater from 'electron-updater';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { autoUpdater } = updater;

// The page is served from a private scheme so fetch() can load the model, themes and WASM files.
const APP_SCHEME = 'app';
const distDir = path.join(app.getAppPath(), 'dist');

protocol.registerSchemesAsPrivileged([
  { scheme: APP_SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

// Maps app://app/<path> to a file inside dist/, refusing anything outside it.
function serveFromDist(request) {
  const { pathname } = new URL(request.url);
  const relative = decodeURIComponent(pathname) === '/' ? 'index.html' : decodeURIComponent(pathname).slice(1);
  const file = path.normalize(path.join(distDir, relative));
  if (!file.startsWith(distDir)) return new Response('Not found', { status: 404 });
  return net.fetch(pathToFileURL(file).toString());
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 860,
    title: 'Müzik → Nota',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  win.loadURL(`${APP_SCHEME}://app/index.html`);
}

// Asks before downloading and before restarting; a failed check never bothers the user.
function setupUpdates() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = false;

  autoUpdater.on('update-available', async info => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['İndir', 'Sonra'],
      defaultId: 0,
      cancelId: 1,
      message: `Yeni sürüm var: ${info.version}`,
      detail: 'Güncelleme indirilsin mi? İndirme bitince yeniden başlatarak kurabilirsiniz.',
    });
    if (response === 0) autoUpdater.downloadUpdate().catch(() => {});
  });

  autoUpdater.on('update-downloaded', async () => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['Şimdi yeniden başlat', 'Uygulama kapanınca'],
      defaultId: 0,
      cancelId: 1,
      message: 'Güncelleme indirildi.',
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', err => console.error('Güncelleme denetimi başarısız:', err));
  autoUpdater.checkForUpdates().catch(() => {});
}

// Only one window at a time: a second launch focuses the existing one.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    protocol.handle(APP_SCHEME, serveFromDist);
    createWindow();
    setupUpdates();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
