/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Adapter } from 'next-auth/adapters'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { parseCookies, destroyCookie } from 'nookies'

import { prisma } from '../prisma'

export const PrismaAdapter = (
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): Adapter => ({
  async createUser(createdUser) {
    console.log('CREATED USER PAYLOAD: ', createdUser)

    const { '@ignite-call:userId': userIdOnCookies } = parseCookies({ req })

    if (!userIdOnCookies) {
      throw new Error('User id not found on cookies.')
    }

    const user = await prisma.user.update({
      where: {
        id: userIdOnCookies,
      },
      data: {
        name: createdUser.name,
        email: createdUser.email,
        avatar_url: createdUser.avatar_url,
      },
    })

    destroyCookie({ res }, '@ignite-call:userId', { path: '/' })

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email!,
      avatar_url: user.avatar_url!,
      emailVerified: null,
    }
  },

  async getUser(id) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email!,
      avatar_url: user.avatar_url!,
      emailVerified: null,
    }
  },

  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email!,
      avatar_url: user.avatar_url!,
      emailVerified: null,
    }
  },

  async getUserByAccount({ providerAccountId, provider }) {
    const account = await prisma.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider,
          provider_account_id: providerAccountId,
        },
      },
      include: {
        user: true,
      },
    })

    if (!account) {
      return null
    }

    const { user } = account

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email!,
      avatar_url: user.avatar_url!,
      emailVerified: null,
    }
  },

  async updateUser(updatedUser) {
    const user = await prisma.user.update({
      where: {
        id: updatedUser.id,
      },
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        avatar_url: updatedUser.avatar_url,
      },
    })

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email!,
      avatar_url: user.avatar_url!,
      emailVerified: null,
    }
  },

  async linkAccount(account) {
    await prisma.account.create({
      data: {
        user_id: account.userId,
        type: account.type,
        provider: account.provider,
        provider_account_id: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      },
    })
  },

  async createSession({ sessionToken, userId, expires }) {
    await prisma.session.create({
      data: {
        user_id: userId,
        session_token: sessionToken,
        expires,
      },
    })

    return {
      sessionToken,
      userId,
      expires,
    }
  },

  async getSessionAndUser(sessionToken) {
    const session = await prisma.session.findUnique({
      where: {
        session_token: sessionToken,
      },
      include: {
        user: true,
      },
    })

    if (!session) {
      return null
    }

    const { user } = session

    return {
      session: {
        userId: session.user_id,
        expires: session.expires,
        sessionToken: session.session_token,
      },
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      },
    }
  },

  async deleteSession(sessionToken) {
    await prisma.session.delete({
      where: {
        session_token: sessionToken,
      },
    })
  },

  async updateSession({ sessionToken, userId, expires }) {
    const session = await prisma.session.update({
      where: {
        session_token: sessionToken,
      },
      data: {
        user_id: userId,
        expires,
      },
    })

    return {
      expires: session.expires,
      userId: session.user_id,
      sessionToken: session.session_token,
    }
  },
})
