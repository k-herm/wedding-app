import { NowRequest, NowResponse } from '@vercel/node'
import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
import fetchQuery from './hasura'

export default async (
  req: NowRequest,
  res: NowResponse,
  cb: () => Promise<void>
): Promise<void> => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '')
    if (!isValidUserToken(token)) {
      res.redirect(401, '/')
      return
    }
  } else {
    if (!req.body?.password || req.body.password !== process.env.GUEST_SECRET) {
      res.status(401).send({ error: 'Incorrect password' })
      return
    }

    const user = await generateNewUserToken()
    const jwt = generateJwt(user)
    res.status(200).send({ token: jwt })
  }
  cb()
}

async function generateNewUserToken(): Promise<{
  user_id: string
  token: string
}> {
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

function generateJwt(payload: { user_id: string; token: string }) {
  const expiry = Date.now() + 1000 * 30
  return jwt.sign({ ...payload, expiry }, process.env.JWT_SECRET, {
    issuer:
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_DOMAIN
        : process.env.APP_DOMAIN,
    expiresIn: expiry
  })
}

async function isValidUserToken(token: string): Promise<boolean> {
  try {
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET)
    const query = `
      query checkUser {
        Users(where: { token: { _eq: "${(decodedJwt as Token).token}"} }) {
          user_id
        }
      }
    `
    const { Users } = await fetchQuery({ query })
    if (
      Users.length > 0 &&
      Users[0].user_id === (decodedJwt as Token).user_id
    ) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

type Token = {
  token: string
  user_id: string
}
