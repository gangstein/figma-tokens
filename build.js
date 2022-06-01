import android from './platforms/android/index.js';
import compose from './platforms/compose/index.js';
import ios from './platforms/ios/index.js';
import flutter from './platforms/flutter/index.js';
import web from './platforms/web/index.js';
import StyleBuilder from './style-builder.js';
import StyleDictionary from 'style-dictionary';

const sourceConfig = {
  source: ['tokens/**/*.json']
}

StyleBuilder(StyleDictionary.extend(sourceConfig))
  .extendWith(web)
  .extendWith(android)
  .extendWith(compose)
  .extendWith(ios)
  .extendWith(flutter)
  .build();