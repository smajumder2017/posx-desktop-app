import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { app, BrowserWindow, shell } from 'electron';
import { exec } from 'child_process';

import log from 'electron-log/main';
const isDev = !app.isPackaged;

log.initialize();

if (isDev) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron-reloader')(module);
  } catch (_) {}
}

const createWindow = async () => {
  try {
    log.info('Log from the main process');

    const win = new BrowserWindow({
      width: 800,
      height: 600,
    });
    if (!isDev) {
      exec('npx prisma migrate deploy');
    }

    await bootstrap();
    win.loadFile('./electron/index.html');
    shell.openExternal(`http://localhost:${isDev ? 5173 : 8080}`);
    log.info(app.getAppPath());
  } catch (error) {
    log.error(error);
  }
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: log,
  });
  app.setGlobalPrefix('/api');
  app.enableCors();
  await app.listen(8080);
}
