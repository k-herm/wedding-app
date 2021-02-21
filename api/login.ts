import { NowRequest, NowResponse } from '@vercel/node'
import { randomBytes } from 'crypto'
import fetchQuery from './utils/hasura'
import { setCookieAndJwt, Token, COOKIE_EXPIRY } from './utils/with-auth'

const ADMIN_COOKIE_EXPIRY = 1000 * 60 * 60 * 24
const ADMIN_URL = '/admin'

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  try {
    const body = JSON.parse(req.body)
    if (!body.password) {
      res.status(401).send({ error: 'No password entered' })
      return
    }

    if (req.url === ADMIN_URL && body.password !== process.env.ADMIN_SECRET) {
      res.status(401).send({ error: 'Incorrect Password' })
      return
    }

    if (req.url !== ADMIN_URL && body.password !== process.env.GUEST_SECRET) {
      res.status(401).send({ error: 'Incorrect Password' })
      return
    }

    const user = await generateNewUserToken()
    const expiry = req.url === ADMIN_URL ? ADMIN_COOKIE_EXPIRY : COOKIE_EXPIRY
    const permission = req.url === ADMIN_URL ? 'admin' : 'user'

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
