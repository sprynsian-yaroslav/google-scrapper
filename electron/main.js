import { app, BrowserWindow } from 'electron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url'; // Імпорт для отримання поточного шляху файлу
import path from 'path';
import isDev from 'electron-is-dev';

// Створюємо еквівалент __filename і __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // Прелоад скрипт
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (!isDev) {
    process.env.NODE_ENV = 'production';
  } else {
    process.env.NODE_ENV = 'development';
  }

  win.loadURL(
    isDev
      ? 'http://localhost:3000' // У режимі розробки фронтенд доступний на цьому URL
      : `file://${path.join(__dirname, '../frontend/build/index.html')}` // У продакшн-режимі звертаємось до білда
  );


  win.webContents.openDevTools(); // Відкриваємо DevTools тільки у режимі розробки

}

// Запуск бекенду NestJS
function startBackend() {
  const backendPath = isDev
    ? path.join(__dirname, '../backend/dist/src/main.js') // Путь до білда бекенду в режимі розробки
    : path.join(process.resourcesPath, 'backend/src/main.js'); // Путь до білда бекенду у продакшн-режимі

  backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
  });
}

app.whenReady().then(() => {
  // Створення вікна
  createWindow();

  // Запуск бекенду
  startBackend();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill(); // Закриваємо бекенд при закритті всіх вікон
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});