describe('elements', function () {
  let tool = roderuda.get('elements')

  beforeEach(function () {
    roderuda.show('elements')
  })

  describe('api', function () {
    it('select element', function () {
      tool.select(document.body)
    })
  })
})
