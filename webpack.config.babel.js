import path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SVGSpritemapPlugin from 'svg-spritemap-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';

import sass from 'sass';
import data from './src/data';

const templatesPath = [
  path.resolve(__dirname, 'src/templates/'),
  path.resolve(__dirname, 'src/templates/includes'),
  path.resolve(__dirname, 'src/templates/layouts'),
  path.resolve(__dirname, 'src/templates/components'),
];

export default (argv, mode) => ({
  entry: ['@babel/polyfill', './src/entry.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `scripts/[name].[hash:8].js`,
    publicPath: '/',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceMaps: true,
          },
        },
      },
      {
        test: /\.njk$/,
        use: [
          {
            loader: 'nunjucks-isomorphic-loader',
            query: {
              root: templatesPath,
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        include: [path.resolve(__dirname, 'src/assets/images')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'images/',
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `styles/[name].[hash:8].css`,
      esModule: true,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify:
        mode === 'development'
          ? false
          : {
              collapseWhitespace: true,
              removeComments: true,
            },
      template: './src/templates/index.njk',
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options,
          },
          ...data,
        };
      },
    }),
    new SVGSpritemapPlugin(
      path.resolve(__dirname, 'src/assets/images/icons/**/*.svg'),
      {
        output: {
          filename: 'images/icons.svg',
          svgo: true,
        },
        sprite: {
          prefix: 'svg-',
        },
      }
    ),
    new CopyWebpackPlugin([
      {
        from: 'src/assets/images/',
        to: 'images/[name].[ext]',
        ignore: ['icons/'],
      },
    ]),
    new ImageminPlugin({
      test: '/.(jpe?g|png|gif|svg)$/i',
    }),
  ],
});
