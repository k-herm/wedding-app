import { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

import fetchQuery from './utils/hasura'
import { getUserQuery, Permission, Token } from './utils/with-auth'

const tokenRegex = /refreshToken=\[.*\]/g

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  try {
    const { cookie } = req.headers
    if (!cookie || !cookie.match(tokenRegex)) {
      res.status(401).send({ error: 'Please login.' })
      return
    }

    const { refreshToken, exp } = parseCookie(req.headers.cookie)
    const user = await getUserRefresh(refreshToken)
    if (!user) {
      res.status(401).send({ error: 'Please try again.' })
      return
    }

    let permission: Permission | null = 'user'
    if (req.headers.authorization) {
      const jwtToken = req.headers.authorization.replace('Bearer ', '')
      permission = getPermissionFromJwt(jwtToken)
      if (!permission) {
        res.redirect(401, '/')
        return
      }
    }

    const expiry = ((exp as unknown) as number) || null
    setCookieAndJwt(res, user, permission, expiry)
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong refreshing token' })
    console.error(error)
  }
}

function getPermissionFromJwt(token: string): Permission | null {
  try {
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET)
    return (decodedJwt as Token).permission
  } catch (error) {
    return null
  }
}

export function setCookieAndJwt(
  res: VercelResponse,
  data: Token,
  permission: Permission,
  expiry?: number
): void {
  const jwt = generateJwt(data, permission)
  res.setHeader('Set-Cookie', generateCookie(data.token, expiry))
  res.status(200).send({ data: { token: jwt } })
}

function generateJwt(payload: Token, permission: Permission): string {
  return jwt.sign({ ...payload, permission }, process.env.JWT_SECRET, {
    issuer:
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_DOMAIN
        : process.env.APP_DOMAIN,
    expiresIn: '25m'
  })
}

function generateCookie(token: string, expiry?: number): string {
  const prodSettings = `domain=${process.env.APP_DOMAIN}; secure`
  const defaultSettings = `refreshToken=${JSON.stringify([token, expiry])}; ${
    expiry ? `expires=${new Date(expiry)}; ` : ''
  }path=/; httpOnly;`

  return process.env.NODE_ENV === 'development'
    ? defaultSettings
    : `${defaultSettings} ${prodSettings}`
}

function parseCookie(cookie: string): Record<string, string> {
  const token = cookie.match(tokenRegex)
  const cookieArr = JSON.parse(token[0].replace('refreshToken=', ''))
  return { refreshToken: cookieArr[0], exp: cookieArr[1] }
}

const updateUserToken = (userId: string) => {
  const token = randomBytes(12).toString('base64')
  return `
    mutation upateUserToken {
      update_Users(
        where: { user_id: { _eq: "${userId}"} }, 
        _set: { token: "${token}" }
      ) {
        returning {
          user_id
          token
        }
      }
    }
  `
}

async function getUserRefresh(token: string): Promise<Token> {
  try {
    const { Users } = await fetchQuery({ query: getUserQuery(token) })
    if (Users.length > 0) {
      const { update_Users } = await fetchQuery({
        query: updateUserToken(Users[0].user_id)
      })
      return update_Users.returning[0] as Token
    }
    return null
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
