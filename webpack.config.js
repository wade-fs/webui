const webpack = require("webpack");
const path = require("path");
const os = require("os");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
  const getEnv = (name, defaultValue) =>
    env != null && env[name] != null ? env[name] : defaultValue;

  const layoutFolder = "./src/pages/layout";

  const dev = path.basename(require.main.filename) === "webpack-dev-server.js";
  let production = JSON.parse(getEnv("production", !dev));

  let entry = {};

  let plugins = [
    new webpack.DefinePlugin({
      API_ENDPOINT: JSON.stringify(getEnv("api", "http://localhost:8085/api")),
      WS_ENDPOINT: JSON.stringify(getEnv("ws", "ws://localhost:8085")),
      VISTA_Q8_VERSION: {
        //build info
        time: new Date().getTime(),
        buildHost: JSON.stringify(os.hostname()),
        buildby: JSON.stringify(os.userInfo().username),
        version: JSON.stringify(require("./package.json").version),
      },
    }),
    new MiniCssExtractPlugin({
      filename: `css/[${production ? "chunkhash" : "name"}].css`,
    }),
  ];

  fs.readdirSync(layoutFolder).forEach((name) => {
    let f = path.parse(name);

    entry[f.name] = `${layoutFolder}/${name}`;

    plugins.push(
      new HtmlWebpackPlugin({
        chunks: [f.name],
        chunksSortMode: "manual",
        filename: `${dev ? "" : "../"}${f.name}.html`,
        template: `${layoutFolder}/../${f.name}.html`,
        minify: { collapseWhitespace: production },
      })
    );
  });

  return {
    mode: !production ? "development" : "production",
    devtool: !production ? "inline-sourcemap" : false,
    resolve: {
      modules: [path.resolve("./src"), "node_modules"],
    },
    optimization: {
      runtimeChunk: false,
      /*
      splitChunks: {
        minChunks: 1,
        chunks: 'all',
        cacheGroups: {
          default: false,
          polyfill: {
            test: /[\\/]@babel\/polyfill[\\/]/,
            name: "lib/polyfill",
            priority:  12,
            enforce: true
          },
          css: {
            test(m,c,entry){
              if(m.constructor.name === 'CssModule' && m.context.match(/[\\/]node_modules[\\/]/)) return true;
            },
            name: "others",
            priority: 11,
            enforce: true
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "lib/react",
            priority: 10,
            enforce: true
          },
          others: {
            test: /[\\/]node_modules[\\/]/,
            name: "lib/others",
            priority: 1,
            enforce: true
          }
        }
      },
      */
      ...(!production
        ? {}
        : {
            minimizer: [
              new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
              }),
              new OptimizeCSSAssetsPlugin({}),
            ],
          }),
    },
    entry,
    output: {
      path: path.join(__dirname, dev ? `` : `q8server/www/assets`),
      filename: `js/[${!production ? "name" : "chunkhash"}].js`,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      esmodules: true,
                    },
                  },
                ],
                "@babel/react",
              ],
              plugins: [
                "react-html-attrs",
                "@babel/plugin-proposal-class-properties",
                [
                  "@babel/plugin-proposal-decorators",
                  { legacy: false, decoratorsBeforeExport: true },
                ],
                "@babel/plugin-proposal-function-bind",
              ],
            },
          },
        },
        {
          test: /\.(sc|sa|c)ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf)|(png|svg|gif)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 500,
                emitFile: true,
                useRelativePath: false,
                name: `${production ? "[hash]" : "[name]"}.[ext]`,
                outputPath: "resources",
                publicPath: "../resources",
              },
            },
          ],
        },
      ],
    },
    plugins,
    devServer: {
      index: "index.html",
      quiet: false,
      disableHostCheck: true,
    },
  };
};
