module.exports = {
    entry: {
        demo: "./src/js/demo.js",
        playImage: "./src/js/playImage.js"
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/public/js'
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
};
