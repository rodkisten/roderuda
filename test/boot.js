function boot(name, cb) {
  // Need a little delay to make sure width and height of webpack dev server iframe are initialized.
  setTimeout(function () {
    let options = {
      useShadowDom: false,
      defaults: {
        displaySize: 50,
        transparency: 0.9,
        theme: 'Monokai Pro',
      },
    }
    if (name) {
      options.tool = name === 'settings' ? [] : name
    }

    try {
      roderuda.init(options)
    } catch (e) {
      alert(e)
    }
    roderuda.show()

    cb && cb()

    if (name == null) return

    loadJs('lib/boot', function () {
      loadJs('lib/jasmine-jquery', function () {
        // This is needed to trigger jasmine initialization.
        loadJs(name, function () {
          window.onload()
        })
      })
    })
  }, 500)
}

function loadJs(src, cb) {
  let script = document.createElement('script')
  script.src = src + '.js'
  script.onload = cb
  document.body.appendChild(script)
}
