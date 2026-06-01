describe('sources', function () {
  let tool = roderuda.get('sources')
  let $tool = $('.roderuda-sources')

  beforeEach(function () {
    roderuda.show('sources')
  })

  it('raw', function () {
    tool.set('raw', '/* test */')
  })
})
