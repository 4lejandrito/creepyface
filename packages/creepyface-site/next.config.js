const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy()({
  async rewrites() {
    return [
      {
        source: '/img/:slug*.gif',
        destination: '/api/img/:slug*?format=gif',
      },
      {
        source: '/img/:slug*',
        destination: '/api/img/:slug*',
      },
      {
        source: '/:uuid/download',
        destination: '/api/:uuid/download',
      },
      {
        source: '/api/:uuid/download',
        destination: '/api/content/:uuid/creepyface.zip',
      },
      {
        source: '/content/:slug*',
        destination: '/api/content/:slug*',
      },
      {
        source: '/creepyface.js',
        destination: '/api/creepyface.js',
      },
      {
        source: '/creepyface-firefly.js',
        destination: '/api/creepyface-firefly.js',
      },
    ]
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.externals = {
        creepyface: 'creepyface',
      }
    }
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: `/_next/static/mp3/`,
            outputPath: `static/mp3/`,
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    })
    config.module.rules.push({ test: /\.hbs$/, loader: 'handlebars-loader' })
    return config
  },
})
