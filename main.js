const insertCss = (className, styles, target = '#css-text') => {
  const stylesText = Object.keys(styles).map(key => `  ${key}: ${styles[key]};`).join('\n')
  const text = `${className} {\n${stylesText}\n}`
  const height = (Object.keys(styles).length + 2) * 1.5
  $(target).text(text).css("height", height + "em")
}

const applyCss = (className, styles, target = '#css-text') => {
	insertCss(className, styles, target)
	$(className).css(styles)
}

const copyButton = $(".copy-button");
copyButton.click((e) => {
  const targetId = $(e.target).attr('data-target-id')
  $('#' + targetId).select()
  document.execCommand("Copy")
  window.getSelection().empty()
  copyButton.addClass('copied')
  setTimeout(() => copyButton.removeClass('copied'), 1000);
})