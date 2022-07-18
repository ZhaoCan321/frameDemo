/*
 * @Author: zhaozhuo
 * @Date: 2022-07-08 10:03:56
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-14 12:23:19
 * @Description: ...
 */
const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')
const GenerateAppletVersionWebpackPlugin = require('generate-appletversion-webpack-plugin')

const publicPath = process.env.NODE_ENV === 'production' ? './' : '/'
const addPlugins = process.env.NODE_ENV === 'production' ? [new GenerateAppletVersionWebpackPlugin()] : []

module.exports = defineConfig({
  publicPath,
  productionSourceMap: false,
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()]
      }),
      ...addPlugins
    ]
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_NGINX_PATH]: {
        target: process.env.VUE_APP_BASE_API,
        ws: true,
        changeOrigin: true,
        timeout: 3 * 60 * 1000,
        pathRewrite: {
          ['^' + process.env.VUE_APP_NGINX_PATH]: ''
        }
      }
    }
  }
})
