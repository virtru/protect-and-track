module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.(html)$/,
    use: {
      loader: 'html-loader',
      options: {
        attrs: [':data-src'],
      },
    },
  });

  return config;
};
