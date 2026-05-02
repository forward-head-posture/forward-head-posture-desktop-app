const { menubar } = require("menubar")
const { ipcMain, nativeImage, Tray } = require("electron")

const { NODE_ENV } = process.env

const TRAY_ICON_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAhFBMVEUAAADs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PFed9IBAAAAK3RSTlMAAQMEBQYLIScqLC0vMjU2ODk+QkN+f4KGi46SlZeanbe5wMHDyNni8/f9aI/hMAAAAH5JREFUGBmdwUkCgjAQBMCORkTcjUFxBaOi0///n3OKgSNVGGbzytHnSCnQZUqqAin3sCXJLxI7qYL15BV/W9k3DNbfDaK1uIbk0xpES3E11c0gWoirqS4G0VxcTXU2iGafd6A6ISHTrCVZIcV8nLU8ooNcjcIBXVQePROFgX5ezA2dwHGGSQAAAABJRU5ErkJggg=="

let tray

ipcMain.on("average", (_, average) => {
  if (process.platform === "darwin") {
    tray.setTitle(Math.round(average).toString())
  }
})

module.exports = function createMenubar() {
  tray = new Tray(nativeImage.createFromDataURL(TRAY_ICON_DATA_URL))
  const mb = menubar({
    browserWindow: {
      show: true,
      width: NODE_ENV === "development" ? 1024 : 480,
      height: 640,
      webPreferences: {
        nodeIntegration: true,
        backgroundThrottling: false
      }
    },
    env: { NODE_ENV: "test" },
    index: `file://${__dirname}/app.html`,
    tray
  })

  mb.on("ready", () => {
    mb.showWindow()
  })
}
