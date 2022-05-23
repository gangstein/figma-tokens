const StyleDictionary = require('style-dictionary');
const { cssFormatter, scssFormatter } = require('./format');

StyleDictionary
  .registerFormat({
    name: 'scssFormat',
    formatter: scssFormatter,
  }).registerFormat({
    name: 'cssFormat',
    formatter: cssFormatter,
});

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.scss',
          format: 'scssFormat',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.css',
          format: 'cssFormat',
        },
      ],
    },
  },
};
