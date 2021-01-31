module.exports = {
  stories: ['../src/stories.tsx'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-storysource'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('awesome-typescript-loader'),
        },
      ],
    })
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    })
    config.module.rules.push({
      test: /stories\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: { parser: 'typescript' },
        },
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
}
