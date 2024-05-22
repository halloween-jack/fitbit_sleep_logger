import { getAccessToken, getSleepLog } from './fitbit'
import { Credentials, Env } from './types'

const scheduled: ExportedHandlerScheduledHandler<Env> = async (_, env, ctx) => {
  ctx.waitUntil(handleScheduled(env))
}

async function handleScheduled(env: Env) {
  const rawCredentials = await env.FITBIT_SLEEP_LOGGER.get("credentials")

  if (!rawCredentials) {
    throw Error("should be set credentials")
  }

  let credentials: Credentials = JSON.parse(rawCredentials)

  // Tokenの有効期限チェックを行い、期限切れだった場合はTokenを取得し直しKVに保存する。
  if (Date.now() >= new Date(credentials.expiresIn * 1000).getTime()) {
    const res = await getAccessToken(env.CLIENT_ID, env.CLIENT_SECRET, credentials.refreshToken);
    credentials = res
    await env.FITBIT_SLEEP_LOGGER.put("credentials", JSON.stringify(res))
  }

  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString().split('T')[0];
  const sleepLog = await getSleepLog(credentials.accessToken, date)

  await saveToR2(env, date, sleepLog);
}

async function saveToR2(env: Env, key: string, data: string) {
  return await env.FITBIT_SLEEP_LOGGER_BUCKET.put(key, data)
}

export default {
  scheduled
}
