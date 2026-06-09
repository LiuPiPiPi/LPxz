module.exports = function stripGoogleFontsImport(source) {
  return source.replace(/@import\s+url\((["']?)https:\/\/fonts\.googleapis\.com\/[^)]*\1\);?/g, '')
}
