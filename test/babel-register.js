import register from '@babel/register';

register({
  extensions: ['.ts', '.js'],
  ignore: [/node_modules/],
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript'
  ]
});
