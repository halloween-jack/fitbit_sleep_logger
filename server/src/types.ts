export type Env = {
  FITBIT_SLEEP_LOGGER: KVNamespace
  FITBIT_SLEEP_LOGGER_BUCKET: R2Bucket
  CLIENT_ID: string
  CLIENT_SECRET: string
}

export type Credentials = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}


