module.exports = {
    entry: './main.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [ ['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }] ]
                    }
                }
            }
        ]
    },
    mode: 'development'
}