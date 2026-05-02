/* eslint global-require: off */
const log = require("electron-log")
const { app } = require("electron")
const { autoUpdater } = require("electron-updater")
const createMenubar = require("./createMenubar")
const packageJSON = require("../package")

if (process.platform === "win32") {
  app.setAppUserModelId(packageJSON.build.appId)
}

class AppUpdater {
  constructor() {
    log.transports.file.level = "info"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

const { NODE_ENV, DEBUG_PROD, UPGRADE_EXTENSIONS } = process.env
const development = NODE_ENV === "development"

if (NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support")
  sourceMapSupport.install()
}

if (development || DEBUG_PROD === "true") {
  require("electron-debug")()
}

const installExtensions = async () => {
  const installer = require("electron-devtools-installer")
  const forceDownload = !!UPGRADE_EXTENSIONS
  const extensions = ["REACT_DEVELOPER_TOOLS"]

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
    // eslint-disable-next-line no-console
  ).catch(console.log)
}

async function createWindow() {
  if (development || DEBUG_PROD === "true") {
    await installExtensions()
  }
  createMenubar()
  // eslint-disable-next-line no-new
  new AppUpdater()
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("ready", createWindow)
