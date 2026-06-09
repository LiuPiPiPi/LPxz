const path = require('path')

module.exports = {
  devServer: {
    historyApiFallback: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'api': '@/api',
        'views': '@/views',
        'plugins': '@/plugins'
      }
    }
  },
//   [Vue warn]: Failed to resolve component: meting-js
// If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
//     at <MyAPlayer>
// at <ArticleIndex onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< undefined > >
//     at <RouterView>
//     at <App render=fn<render> >
  chainWebpack: config => {
    const stripGoogleFontsLoader = path.resolve(__dirname, 'scripts/strip-google-fonts-import-loader.js')
    const cssRule = config.module.rule('css')
    ;['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(oneOfName => {
      cssRule
          .oneOf(oneOfName)
          .use('strip-google-fonts-import-loader')
          .loader(stripGoogleFontsLoader)
          .before('css-loader')
    })

    config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          options['compilerOptions'] = {
            ...options.compilerOptions || {},
            isCustomElement: tag => tag === 'meting-js'
          };
          return options;
        })
  },
  lintOnSave:false,//关闭eslintre语法检查
}
