const applyCss = (className, styles, target = '#css-text') => {
  const stylesText = Object.keys(styles)
    .map(key => `  ${key}: ${styles[key]};`)
    .join('\n')
  const text = `${className} {\n${stylesText}\n}`
  const height = (Object.keys(styles).length + 2) * 1.5
  $(target)
    .text(text)
    .css('height', height + 'em')
  $(className).css(styles)
}

$('.copy-button').click(e => {
  const targetId = $(e.target).attr('data-target-id')
  const button = $('#' + e.target.id)
  $('#' + targetId).select()
  document.execCommand('Copy')
  window.getSelection().empty()
  button.addClass('copied')
  setTimeout(() => button.removeClass('copied'), 1000)
})
