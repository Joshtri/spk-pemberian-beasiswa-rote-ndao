import jwt from 'jsonwebtoken'

export async function getAuthUser(request, allowedRoles = []) {
  const cookieHeader = request.headers.get('cookie') || ''
  const tokenFromCookie = cookieHeader
    .split('; ')
    .find(c => c.startsWith('auth_token='))
    ?.split('=')[1]

  const tokenFromHeader = request.headers
    ?.get('authorization')
    ?.split(' ')[1]

  const token = tokenFromCookie || tokenFromHeader

  if (!token) {
    const error = new Error('TOKEN_MISSING')
    error.code = 'TOKEN_MISSING'
    throw error
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      const error = new Error('FORBIDDEN')
      error.code = 'FORBIDDEN'
      throw error
    }

    return user
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const error = new Error('TOKEN_EXPIRED')
      error.code = 'TOKEN_EXPIRED'
      throw error
    }

    const error = new Error('TOKEN_INVALID')
    error.code = 'TOKEN_INVALID'
    throw error
  }
}
