'use strict';

module.exports = function (env, argv) {
    const path = require('path');
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

    const isProduction = argv.mode === 'production';
    const isDevelopment = argv.mode === 'development';

    const commonCssLoaders = ['css-loader', 'postcss-loader'];

    const componentCssLoaders = ['to-string-loader'].concat(commonCssLoaders);

    if (isProduction) {
        componentCssLoaders.push('clean-css-loader');
    }

    const mainCssLoaders = [MiniCssExtractPlugin.loader].concat(commonCssLoaders);

    const mainCssPath = path.resolve(__dirname, 'src/index.css');

    let config = {
        mode: argv.mode,
        entry: {
            'app': './src'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['env', { targets: { chrome: 67 } }]
                        ]
                    }
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            minimize: isProduction,
                            removeComments: true,
                            collapseWhitespace: true,
                            conservativeCollapse: false,
                            collapseInlineTagWhitespace: true
                        }
                    }
                },
                {
                    test: /\.css$/,
                    exclude: mainCssPath,
                    use: componentCssLoaders
                },
                {
                    test: mainCssPath,
                    use: mainCssLoaders
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                            name: isProduction ? '[name].[contenthash].[ext]' : '[name].[ext]'
                        }
                    }
                },
                {
                    test: /\.(eot|ttf|otf|woff|woff2)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 65000,
                            name: isProduction ? '[name].[contenthash].[ext]' : '[name].[ext]'
                        }
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? './[name].[contenthash].css' : './[name].css'
            })
        ]
    };

    if (isProduction) {
        config.optimization = {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false
                }),
                new OptimizeCSSAssetsPlugin()
            ]
        };
    }

    if (isDevelopment) {
        config.watch = true;
        config.devtool = 'eval';
        config.devServer = {
            contentBase: path.join(__dirname, 'dist'),
            port: 4000
        }
    }

    return config;
};