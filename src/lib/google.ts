import { google } from 'googleapis'
import { prisma } from './prisma'
import process from 'process'
import dayjs from 'dayjs'

export const getGoogleOAuthToken = async (userId: string) => {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: 'google',
      user_id: userId,
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  })

  if (!account.expires_at) {
    return auth
  }

  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()
    const {
      access_token: accessToken,
      expiry_date: expiresAt,
      id_token: idToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      scope,
    } = credentials

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token: accessToken,
        id_token: idToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        expires_at: expiresAt ? Math.floor(expiresAt / 1000) : null,
        scope,
      },
    })

    auth.setCredentials(credentials)
  }

  return auth
}
