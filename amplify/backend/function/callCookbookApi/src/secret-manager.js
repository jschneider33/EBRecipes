const AWS = require('aws-sdk')
module.exports = async () => {
  const secretsManager = new AWS.SecretsManager()
  const secret = await secretsManager.getSecretValue({ SecretId: 'RAPIDAPI_API_KEY' }).promise()
  if (!secret) {
    throw new Error('Secret not found')
  }
  return JSON.parse(secret.SecretString)
}