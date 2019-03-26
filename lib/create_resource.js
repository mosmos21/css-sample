const fs = require('fs')

Array.prototype.sliceBySeparator = function (separator) {
  const pos = this.findIndex(ele => ele.trim() === separator)
  if (pos == -1) {
    return [this]
  }
  return [
    this.slice(0, pos),
    ...this.slice(pos + 1).sliceBySeparator(separator)
  ]
}

const cssLoader = file => {
  return fs
    .readFileSync(file)
    .toString()
    .split('\n')
    .sliceBySeparator('')
    .filter(array => array.length > 0)
    .map(array => ({ [array[0]]: array.slice(1) }))
    .reduce((a, b) => Object.assign(a, b))
}

module.exports = ({ baseFile, componentDir, exportFile }) => {
  if (!baseFile || !componentDir || !exportFile) {
    console.error(
      'error: "baseFile", "componentDir" and "exportFile" are required.'
    )
    return
  }
  const json = JSON.parse(fs.readFileSync(baseFile))
  json['components'] = fs
    .readdirSync(componentDir)
    .map(file => cssLoader(componentDir + file))
    .reduce((a, b) => Object.assign(a, b))
  fs.writeFileSync(exportFile, JSON.stringify(json, null, '  '))
}
