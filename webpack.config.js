const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const fs = require('fs');
const pageData = JSON.parse(fs.readFileSync('data/data.json'));

const htmlPlugins = (pageTitles) => { 
  return pageTitles.map(title => { 
    return new HTMLWebpackPlugin({
      title,
      filename: `${(title != 'index' ? title + '/' : '') + title}.html`,
      template: `./pug/${title.toLowerCase()}.pug`,
      data: pageData[title]
    });
  });
}

module.exports = {
  mode: "development",

	entry: "./entry",
	output: {
		filename: "bundle.js"
	},

  plugins: [
    ...htmlPlugins(['index','about']),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' }
      ]
    })
	],

  module: {
    rules: [
      { 
        test: /\.pug$/, 
        use: ["pug-loader"]
    	},

      { 
        test: /\.css$/, 
        use: [
      		"style-loader",
      		"css-loader"
      	]
      },

      { 
        test: /\.s[ac]ss$/, 
        use: [
          MiniCssExtractPlugin.loader,
	      	// "style-loader",
	      	"css-loader",
	      	"sass-loader"
      	]
      },

      {
        test: /\.svg$/,
        use: ["url-loader"],
      }
    ]
  },

  devServer: {
  	port: 8001,
    writeToDisk: true
  }
};