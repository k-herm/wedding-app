import { NowRequest, NowResponse } from '@vercel/node'
import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
import fetchQuery from './hasura'

const JWT_EXPIRY = 1000 * 60 * 25
export const COOKIE_EXPIRY = 1000 * 60 * 60 * 24 * 365

export default async (
  req: NowRequest,
  res: NowResponse,
  allowedPermission: Permission,
  cb: () => Promise<void>
): Promise<void> => {
  if (req.headers.authorization) {
    const jwt = req.headers.authorization.replace('Bearer ', '')
    const permission = await isValidJwt(jwt)

    if (!permission || permission !== allowedPermission) {
      res.redirect(401, '/')
      return
    }
  } else if (req.headers.cookie) {
    // client session expired (no JWT), only user access is allowed
    if (allowedPermission === 'admin') {
      res.redirect(401, '/')
      return
    }

    const refreshToken = parseCookie(req.headers.cookie)
    const user = await getUserRefresh(refreshToken)

    if (!user.user_id) {
      res.redirect(401, '/')
      return
    }

    setCookieAndJwt(res, user, 'user')
  } else {
    res.redirect(401, '/')
    return
  }
  cb()
}

export function setCookieAndJwt(
  res: NowResponse,
  data: Token,
  permission: Permission,
  expiry?: number
): void {
  const jwt = generateJwt(data, permission)
  res.setHeader('Set-Cookie', generateCookie(data.token, expiry))
  res.status(200).send({ token: jwt })
}

export function generateJwt(payload: Token, permission: Permission): string {
  const expiry = Date.now() + JWT_EXPIRY
  return jwt.sign({ ...payload, permission, expiry }, process.env.JWT_SECRET, {
    issuer:
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_DOMAIN
        : process.env.APP_DOMAIN,
    expiresIn: '25m'
  })
}

function generateCookie(token: string, expiry?: number): string {
  const prodSettings = `domain=${process.env.APP_DOMAIN}; secure`
  const defaultSettings = `refreshToken=${token}; ${
    expiry ? `max-age=${Date.now() + expiry};` : ''
  } httpOnly`
  return process.env.NODE_ENV === 'development'
    ? defaultSettings
    : `${defaultSettings}; ${prodSettings}`
}

export function parseCookie(cookie: string): string {
  const cookieArr = cookie.split(/[=(; )]/)
  const refreshToken =
    cookieArr[cookieArr.findIndex(value => value === 'refreshToken') + 1]
  return refreshToken
}

const getUserQuery = (token: string) => `
  query getUser {
    Users(where: { token: { _eq: "${token}"} }) {
      user_id
      token
    }
  }
`

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

export async function isValidJwt(token: string): Promise<Permission | false> {
  try {
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET)
    const { Users } = await fetchQuery({
      query: getUserQuery((decodedJwt as Token).token)
    })

    if (
      Users.length > 0 &&
      Users[0].user_id === (decodedJwt as Token).user_id
    ) {
      return (decodedJwt as Token).permission
    }

    return false
  } catch (error) {
    return false
  }
}

export async function getUserRefresh(token: string): Promise<Token> {
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
    return null
  }
}

export type Token = {
  token: string
  user_id: string
  permission?: Permission
}

export type Permission = 'user' | 'admin'
