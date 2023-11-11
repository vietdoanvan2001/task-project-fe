const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false
})

// const { defineConfig } = require('@vue/cli-service')

// module.exports = defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false,
//   chainWebpack: (config) => {
//     config.module
//       .rule("vue")
//       .use("vue-loader")
//       .loader("vue-loader")
//       .tap((options) => {
//         // Tùy chỉnh các tùy chọn cài đặt của vue-loader ở đây
//         return options;
//       });

//     // Cài đặt vue-template-compiler
//     config.module
//       .rule("vue")
//       .use("vue-loader")
//       .tap((options) => {
//         options.compiler = require("vue-template-compiler");
//         return options;
//       });
//   },
// })