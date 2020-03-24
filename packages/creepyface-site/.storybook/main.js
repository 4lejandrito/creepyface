module.exports = {
  stories: ['../frontend/stories/*.tsx'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('awesome-typescript-loader')
        }
      ]
    })
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    })
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  }
}
