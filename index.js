const { app, BrowserWindow, globalShortcut } = require('electron')
var path = require('path')
const client = require('discord-rich-presence')('749317071145533440');
var sgname
var sgartist
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    icon: path.join(__dirname, './assets/icon.png'),
    width: 1024,
    height: 600,
    minWidth: 300,
    minHeight: 300,
  // Enables DRM
    webPreferences: {
      plugins: true
    }
  })

  // hide toolbar tooltips / bar
  win.setMenuBarVisibility(false);

  // load Apple Music site
  win.loadURL("https://beta.music.apple.com");

  // hide iTunes prompt and other random bullshittery by Apple.
  win.webContents.on('did-frame-finish-load', function() {
    win.webContents.executeJavaScript("const elements = document.getElementsByClassName('web-navigation__native-upsell'); while (elements.length > 0) elements[0].remove();");
  });

  // hide iTunes prompt and other random bullshittery by Apple again.
  win.webContents.on('did-stop-loading', function() {
    win.webContents.executeJavaScript("while (elements.length > 0) elements[0].remove();");
  });

  // update rich presence when audio is playing.
  win.webContents.on('media-started-playing', function() {
    client.updatePresence({
      state: "(Solo Listening)",
      details: "Listening to Music!",
      startTimestamp: Date.now(),
      endTimestamp: Date.now() + 1337,
      largeImageKey: 'apple',
      smallImageKey: 'credit',
      instance: true,
    });
  });

  // Update rich presence when audio is paused or turned off.
  win.webContents.on('media-paused', function() {
    client.updatePresence({
      state: "(Idling)",
      details: "Music is paused.",
      startTimestamp: Date.now(),
      endTimestamp: Date.now() + 1337,
      largeImageKey: 'apple',
      smallImageKey: 'credit',
      instance: true,
    });
  });

}
// Start rich presence service into idle mode.
client.updatePresence({
  state: 'Choosing music.',
  details: '(Idle)',
  startTimestamp: Date.now(),
  endTimestamp: Date.now() + 1337,
  largeImageKey: 'apple',
  smallImageKey: 'credit',
  instance: true,
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)
