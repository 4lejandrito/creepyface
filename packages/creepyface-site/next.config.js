module.exports = (nextConfig) => ({
  ...nextConfig,
  async redirects() {
    return [
      {
        source: '/img/:slug*',
        destination: '/api/img/:slug*',
        permanent: true,
      },
      {
        source: '/:uuid/download',
        destination: '/api/:uuid/download',
        permanent: true,
      },
      {
        source: '/content/:slug*',
        destination: '/api/content/:slug*',
        permanent: true,
      },
      {
        source: '/creepyface.js',
        destination: '/api/creepyface.js',
        permanent: true,
      },
      {
        source: '/creepyface-firefly.js',
        destination: '/api/creepyface-firefly.js',
        permanent: true,
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
            publicPath: `${nextConfig.assetPrefix || ''}/_next/static/mp3/`,
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
