describe('resources', function () {
  let $tool = $('.roderuda-resources')

  beforeEach(function () {
    roderuda.show('resources')
  })

  describe('localStorage', function () {
    it('show', function () {
      localStorage.clear()
      localStorage.setItem('testKey', 'testVal')
    })

    it('clear', function () {
      $tool.find('.roderuda-local-storage .roderuda-clear-storage').click()
    })
  })

  describe('sessionStorage', function () {
    it('show', function () {
      sessionStorage.clear()
      sessionStorage.setItem('testKey', 'testVal')
    })

    it('clear', function () {
      $tool.find('.roderuda-session-storage .roderuda-clear-storage').click()
    })
  })

  describe('cookie', function () {
    it('show', function () {
      util.cookie.set('testKey', 'testVal')
      $tool.find('.roderuda-refresh-cookie').click()
    })

    it('clear', function () {
      $tool.find('.roderuda-clear-cookie').click()
    })
  })
})
