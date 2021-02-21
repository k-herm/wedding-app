import { NowRequest, NowResponse } from '@vercel/node'
import {
  setCookieAndJwt,
  isValidJwt,
  getUserRefresh,
  parseCookie
} from './utils/with-auth'

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  try {
    if (!req.headers.authorization || !req.headers.cookie) {
      res.status(401).send({ error: 'No token or cookie detected.' })
      return
    }

    const jwt = req.headers.authorization.replace('Bearer ', '')
    const permission = await isValidJwt(jwt)

    if (!permission) {
      res.redirect(401, '/')
      return
    }

    const refreshToken = parseCookie(req.headers.cookie)
    const user = await getUserRefresh(refreshToken)

    setCookieAndJwt(res, user, permission)
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong refreshing token' })
    console.error(error)
  }
}
