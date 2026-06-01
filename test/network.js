describe('network', function () {
  beforeEach(function () {
    roderuda.show('network')
  })

  describe('request', function () {
    it('xhr', function (done) {
      $('.roderuda-clear-xhr').click()
      util.ajax.get(window.location.toString(), function () {
        setTimeout(function () {
          expect($('.roderuda-requests .luna-data-grid-node')).toHaveLength(1)
          done()
        }, 500)
      })
    })
  })
})
