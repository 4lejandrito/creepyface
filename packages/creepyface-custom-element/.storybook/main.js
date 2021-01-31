module.exports = {
  stories: ['../src/stories.js'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-storysource'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /stories\.(js)$/,
      use: [
        {
          loader: require.resolve('@storybook/source-loader'),
        },
      ],
    })
    return config
  },
}
