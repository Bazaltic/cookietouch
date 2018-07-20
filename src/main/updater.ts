import { BrowserWindow, ipcMain } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

export async function appUpdater(win: BrowserWindow, channel: string) {
  log.transports.file.level = "debug";
  autoUpdater.logger = log;

  const channels = ["latest", "beta", "alpha"];
  autoUpdater.channel = channels.includes(channel) ? channel : "latest";

  autoUpdater.on("error", err => log.info(err));
  autoUpdater.on("checking-for-update", () => log.info("checking-for-update"));
  autoUpdater.on("update-available", () => log.info("update-available"));
  autoUpdater.on("update-not-available", () =>
    log.info("update-not-available")
  );
  autoUpdater.on("download-progress", progressObj => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    log.info(log_message);
  });

  autoUpdater.on("update-downloaded", info => {
    win.webContents.send("go-update", info);
  });

  ipcMain.on("ask-quitAndInstall", event => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdates();
}
