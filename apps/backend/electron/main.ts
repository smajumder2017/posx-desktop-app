import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { app, BrowserWindow, shell } from 'electron';
// import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { dbPath, dbUrl, latestMigration, Migration } from './constants';
import { prisma, runPrismaCommand } from './prisma';
import log from 'electron-log/main';
const isDev = !app.isPackaged;

if (require("electron-squirrel-startup")) {
  app.quit();
}

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

    log.info(`Mode:  ${isDev ? 'dev' : 'prod'}`);
    if (!isDev) {
      let needsMigration;
      const dbExists = fs.existsSync(dbPath);
      if (!dbExists) {
        needsMigration = true;
        // prisma for whatever reason has trouble if the database file does not exist yet.
        // So just touch it here
        fs.closeSync(fs.openSync(dbPath, 'w'));
      } else {
        try {
          const latest: Migration[] =
            await prisma.$queryRaw`select * from _prisma_migrations order by finished_at`;
          needsMigration =
            latest[latest.length - 1]?.migration_name !== latestMigration;
        } catch (e) {
          log.error(e);
          needsMigration = true;
        }
      }

      if (needsMigration) {
        try {
          const schemaPath = path.join(
            app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
            'apps',
            'backend',
            'prisma',
            'schema.prisma',
          );
          log.info(
            `Needs a migration. Running prisma migrate with schema path ${schemaPath}`,
          );

          // first create or migrate the database! If you were deploying prisma to a cloud service, this migrate deploy
          // command you would run as part of your CI/CD deployment. Since this is an electron app, it just needs
          // to run every time the production app is started. That way if the user updates the app and the schema has
          // changed, it will transparently migrate their DB.
          await runPrismaCommand({
            command: ['migrate', 'deploy', '--schema', schemaPath],
            dbUrl,
          });
          log.info('Migration done.');

          // seed
          // log.info("Seeding...");
          // await seed(prisma);
        } catch (e) {
          log.error(e);
          process.exit(1);
        }
      } else {
        log.info('Does not need migration');
      }
    }
    // if (!isDev) {
    //   const exc = exec('npm run migrate', (error, stdout, stderror) => {
    //     stderror && log.info(stderror);
    //     stdout && log.info(stdout);
    //   });
    //   exc.on('error', (error) => {
    //     log.info(error);
    //   });
    //   exc.on('exit', async (msg) => {
    //     log.info(msg);
    //     log.info('Migration completed');
    //     await bootstrap();
    //     win.loadFile('./electron/index.html');
    //     shell.openExternal(`http://localhost:${isDev ? 5173 : 8080}`);
    //     log.info(app.getAppPath());
    //   });
    // } else {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    });
    await bootstrap();
    win.loadFile('./electron/index.html');
    shell.openExternal(`http://localhost:${isDev ? 5173 : 8080}`);
    log.info(app.getAppPath());
    // }
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
