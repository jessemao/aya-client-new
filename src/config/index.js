import devConfig from './dev';
import prodConfig from './prod';

export default {
  development: { ...devConfig },
  production: { ...prodConfig },
}[process.env.NODE_ENV || 'production'];
