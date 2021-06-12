import { VercelRequest, VercelResponse } from '@vercel/node'
import { randomBytes } from 'crypto'
import fetchQuery from './utils/hasura'
import { Token, COOKIE_EXPIRY } from './utils/with-auth'
import { setCookieAndJwt } from './refresh'

export const ADMIN_COOKIE_EXPIRY = 1000 * 60 * 60 * 24
const ADMIN_URL = '/admin'

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  try {
    if (req.headers.cookie && req.headers.authorization) {
      res.status(200).send({ message: 'You are logged in.' })
      return
    }

    const { password } = req.body
    if (!password) {
      res.status(401).send({ error: 'No password entered' })
      return
    }

    const domain =
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_DOMAIN
        : process.env.APP_DOMAIN
    const reqUrl = req.headers.referer.replace(domain, '')

    if (reqUrl === ADMIN_URL && password !== process.env.ADMIN_SECRET) {
      res.status(401).send({ error: 'Incorrect Password' })
      return
    }

    if (reqUrl !== ADMIN_URL && password !== process.env.GUEST_SECRET) {
      res.status(401).send({ error: 'Incorrect Password' })
      return
    }

    const user = await generateNewUserToken()
    const expiry =
      Date.now() + (reqUrl === ADMIN_URL ? ADMIN_COOKIE_EXPIRY : COOKIE_EXPIRY)
    const permission = reqUrl === ADMIN_URL ? 'admin' : 'user'

    setCookieAndJwt(res, user, permission, expiry)
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong logging in' })
    console.error(error)
  }
}

async function generateNewUserToken(): Promise<Token> {
  const token = randomBytes(12).toString('base64')
  const mutation = `
      mutation newUser {
        insert_Users_one(object: { token: "${token}" }) {
          user_id
        }
      }
    `
  const { insert_Users_one } = await fetchQuery({ query: mutation })
  return {
    user_id: insert_Users_one.user_id,
    token
  }
}
