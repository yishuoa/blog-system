import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { readDB, writeDB, nextId } from './utils/db.js'
import { signToken, authMiddleware } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

function enrichArticle(article, categories) {
  const category = categories.find(c => c.id === article.categoryId)
  return {
    ...article,
    categoryName: category?.name ?? '未分类'
  }
}

// ── Auth ──
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: '请输入用户名和密码' })
  }

  const db = readDB()
  const user = db.users.find(u => u.username === username)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  const token = signToken({ id: user.id, username: user.username, role: user.role })
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
})

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

// ── Categories ──
app.get('/api/categories', (_req, res) => {
  res.json(readDB().categories)
})

app.post('/api/categories', authMiddleware, (req, res) => {
  const { name, slug } = req.body
  if (!name?.trim()) {
    return res.status(400).json({ message: '分类名称不能为空' })
  }

  const db = readDB()
  const category = {
    id: nextId(db.categories),
    name: name.trim(),
    slug: slug?.trim() || name.trim().toLowerCase().replace(/\s+/g, '-')
  }
  db.categories.push(category)
  writeDB(db)
  res.status(201).json(category)
})

app.put('/api/categories/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const db = readDB()
  const idx = db.categories.findIndex(c => c.id === id)
  if (idx === -1) return res.status(404).json({ message: '分类不存在' })

  const { name, slug } = req.body
  if (name) db.categories[idx].name = name.trim()
  if (slug) db.categories[idx].slug = slug.trim()
  writeDB(db)
  res.json(db.categories[idx])
})

app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const db = readDB()
  const used = db.articles.some(a => a.categoryId === id)
  if (used) {
    return res.status(400).json({ message: '该分类下仍有文章，无法删除' })
  }

  db.categories = db.categories.filter(c => c.id !== id)
  writeDB(db)
  res.json({ message: '删除成功' })
})

// ── Articles ──
app.get('/api/articles', (req, res) => {
  const { categoryId, search } = req.query
  const db = readDB()
  let list = db.articles

  if (categoryId) {
    list = list.filter(a => a.categoryId === Number(categoryId))
  }
  if (search) {
    const kw = search.toLowerCase()
    list = list.filter(
      a => a.title.toLowerCase().includes(kw) || a.summary.toLowerCase().includes(kw)
    )
  }

  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(list.map(a => enrichArticle(a, db.categories)))
})

app.get('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id)
  const db = readDB()
  const article = db.articles.find(a => a.id === id)
  if (!article) return res.status(404).json({ message: '文章不存在' })
  res.json(enrichArticle(article, db.categories))
})

app.post('/api/articles', authMiddleware, (req, res) => {
  const { title, summary, content, categoryId } = req.body
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ message: '标题和内容不能为空' })
  }

  const db = readDB()
  const now = new Date().toISOString()
  const article = {
    id: nextId(db.articles),
    title: title.trim(),
    summary: summary?.trim() || title.trim().slice(0, 80),
    content: content.trim(),
    categoryId: Number(categoryId) || db.categories[0]?.id || 1,
    createdAt: now,
    updatedAt: now
  }
  db.articles.push(article)
  writeDB(db)
  res.status(201).json(enrichArticle(article, db.categories))
})

app.put('/api/articles/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const db = readDB()
  const idx = db.articles.findIndex(a => a.id === id)
  if (idx === -1) return res.status(404).json({ message: '文章不存在' })

  const { title, summary, content, categoryId } = req.body
  const article = db.articles[idx]
  if (title) article.title = title.trim()
  if (summary !== undefined) article.summary = summary.trim()
  if (content) article.content = content.trim()
  if (categoryId) article.categoryId = Number(categoryId)
  article.updatedAt = new Date().toISOString()

  writeDB(db)
  res.json(enrichArticle(article, db.categories))
})

app.delete('/api/articles/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id)
  const db = readDB()
  db.articles = db.articles.filter(a => a.id !== id)
  writeDB(db)
  res.json({ message: '删除成功' })
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
