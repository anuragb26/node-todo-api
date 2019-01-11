const env = process.env.NODE_ENV || 'development'
console.log('env ***** ', env)

if (env === 'development' || env === 'test'){
  const {[env]:envConfig} = require('./config.json')
  Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key])
}