type AuthorizationResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const BASE_URL = "https://api.fitbit.com"

export async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded")
  headers.append("Authorization", `Basic ${btoa(`${clientId}:${clientSecret}`)}`)

  const params = new URLSearchParams()
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", refreshToken)

  const req = new Request(`${BASE_URL}/oauth2/token`, {
    method: "POST",
    headers,
    body: params
  })

  const res = await fetch(req)

  if (!res.ok) {
    throw new Error(`refresh token error: ${await res.text()}`)
  }

  const { access_token: accessToken, refresh_token, expires_in: expiresIn } = await res.json() as AuthorizationResponse;

  return {
    accessToken,
    refreshToken: refresh_token,
    expiresIn
  }
}

export async function getSleepLog(token: string, date: string) {
  const res = await fetch(`${BASE_URL}/1.2/user/-/sleep/date/${date}.json`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.text()
}
