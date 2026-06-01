describe('devTools', function () {
  describe('init', function () {
    it('destroy', function () {
      roderuda.destroy()

      expect($('#roderuda')).toHaveLength(0)
    })

    it('init', function () {
      let container = document.createElement('div')
      container.id = 'roderuda'
      document.body.appendChild(container)

      roderuda.init({
        container: container,
        tool: [],
        useShadowDom: false,
      })

      let $roderuda = $('#roderuda')
      expect($roderuda.find('.roderuda-dev-tools')).toHaveLength(1)
    })
  })

  describe('tool', function () {
    it('add', function () {
      roderuda.add({
        name: 'test',
        init: function ($el) {
          this._$el = $el
          $el.html('Test Plugin')
        },
      })

      expect($('.roderuda-test')).toContainText('Test Plugin')
    })

    it('show', function () {
      let $tool = $('.roderuda-test')
      expect($tool).toBeHidden()
      roderuda.show('test')
      expect($tool).toHaveCss({ display: 'block' })
    })

    it('remove', function () {
      roderuda.remove('test')
      expect($('.roderuda-test')).toHaveLength(0)
    })
  })

  describe('display', function () {
    it('show', function () {
      roderuda.show()
      expect($('.roderuda-dev-tools')).toHaveCss({ display: 'block' })
    })

    it('hide', function (done) {
      roderuda.hide()
      setTimeout(function () {
        expect($('.roderuda-dev-tools')).toBeHidden()
        done()
      }, 500)
    })
  })

  describe('scale', function () {
    it('get', function () {
      roderuda.scale(1)
      expect(roderuda.scale()).toBe(1)
    })
  })
})
