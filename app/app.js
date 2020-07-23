const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let window = null

app.once('ready', () => {
  window = new BrowserWindow({
    width: 500,
    height: 400,
    titleBarStyle: 'hiddenInset',
    backgroundColor: "#111",

    // 窗口准备好了之后再显示，防止白屏影响用户体验
    show: false
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    window.show()
  })
})
