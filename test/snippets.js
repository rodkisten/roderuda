describe('snippets', function () {
  let tool = roderuda.get('snippets')
  let $tool = $('.roderuda-snippets')

  describe('default', function () {
    it('border all', function () {
      expect($tool.find('.roderuda-name').eq(0)).toContainText('Border All')

      let $body = $('body')
      let $btn = $tool.find('.roderuda-run').eq(0)

      $btn.click()
      expect($body).toHaveCss({ outlineWidth: '2px' })
      $btn.click()
      expect($body).toHaveCss({ outlineWidth: '0px' })
    })

    it('refresh page', function () {
      expect($tool.find('.roderuda-name').eq(1)).toContainText('Refresh Page')
    })

    it('search text', function () {
      expect($tool.find('.roderuda-name').eq(2)).toContainText('Search Text')
    })

    it('edit page', function () {
      expect($tool.find('.roderuda-name').eq(3)).toContainText('Edit Page')

      let $body = $('body')
      let $btn = $tool.find('.roderuda-run').eq(3)

      $btn.click()
      expect($body).toHaveAttr('contenteditable', 'true')
      $btn.click()
      expect($body).toHaveAttr('contenteditable', 'false')
    })
  })

  it('clear', function () {
    tool.clear()
    expect($tool.find('.roderuda-name')).toHaveLength(0)
  })

  it('add', function () {
    tool.add(
      'Test',
      function () {
        console.log('eruda')
      },
      'This is the description'
    )
    expect($tool.find('.roderuda-name')).toContainText('Test')
    expect($tool.find('.roderuda-description')).toContainText(
      'This is the description'
    )
  })

  it('remove', function () {
    tool.remove('Test')
    expect($tool.find('.roderuda-name')).toHaveLength(0)
  })
})
