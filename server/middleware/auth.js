import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'blog-system-secret-key-2026'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录或 Token 无效' })
  }

  try {
    const token = header.slice(7)
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Token 已过期，请重新登录' })
  }
}
