import { NowRequest, NowResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import fetchQuery from './hasura'

export const COOKIE_EXPIRY = 1000 * 60 * 60 * 24 * 365

export default async (
  req: NowRequest,
  res: NowResponse,
  allowedPermission: Permission,
  cb: () => Promise<void>
): Promise<void> => {
  if (!req.headers.authorization) {
    res.redirect(401, '/')
    return
  }

  const jwt = req.headers.authorization.replace('Bearer ', '')
  const permission = await isValidJwt(jwt)

  if (!permission || permission !== allowedPermission) {
    res.redirect(401, '/')
    return
  }

  cb()
}

export const getUserQuery = (token: string): string => `
  query getUser {
    Users(where: { token: { _eq: "${token}"} }) {
      user_id
      token
    }
  }
`

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

export type Token = {
  token: string
  user_id: string
  permission?: Permission
}

export type Permission = 'user' | 'admin'
