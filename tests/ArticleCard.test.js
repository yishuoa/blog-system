import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleCard from '@/components/ArticleCard.vue'

const mockArticle = {
  id: 1,
  title: '测试文章',
  summary: '这是一段摘要',
  categoryName: '前端开发',
  createdAt: '2026-05-01T08:00:00.000Z'
}

describe('ArticleCard', () => {
  it('renders article title and summary', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle },
      global: {
        stubs: { 'el-tag': { template: '<span><slot /></span>' } }
      }
    })

    expect(wrapper.text()).toContain('测试文章')
    expect(wrapper.text()).toContain('这是一段摘要')
    expect(wrapper.text()).toContain('前端开发')
  })
})
