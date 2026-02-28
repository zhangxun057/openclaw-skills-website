'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    skillName: '',
    content: '',
    contributor: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)

    try {
      // Send to Cloudflare Worker
      const response = await fetch('https://openclaw-skills-hub-api.zhangxun057.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `技能提交成功！Issue 已创建：${data.issueUrl}`,
        })
        setFormData({ skillName: '', content: '', contributor: '' })
      } else {
        throw new Error(data.error || '提交失败')
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '提交失败，请重试',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center text-orange-100 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-4">提交新技能</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">📋 提交说明</h2>
          <p className="text-blue-800 mb-4">
            填写下方表单提交技能，系统会自动创建 GitHub Issue。张洵审核后会合并到仓库。
          </p>
          <div className="p-4 bg-white rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">技能文件模板：</h3>
            <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
{`# Skill: 技能名称

## 用途
简要说明这个技能解决什么问题。

## 前置条件
- 需要什么工具？
- 需要什么权限？

## 步骤
1. 第一步...
2. 第二步...

## 常见问题
### 问题1
解决方案...

---
_贡献者: 你的名字_
_日期: 2026-02-28_`}
            </pre>
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <div
            className={`rounded-lg p-4 mb-6 ${
              result.success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}
          >
            {result.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="mb-4">
            <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
              技能名称
            </label>
            <input
              type="text"
              id="skillName"
              value={formData.skillName}
              onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="例如：GitHub CLI 登录"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contributor" className="block text-sm font-medium text-gray-700 mb-1">
              贡献者名称
            </label>
            <input
              type="text"
              id="contributor"
              value={formData.contributor}
              onChange={(e) => setFormData({ ...formData, contributor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="你的名字"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              技能内容 (Markdown)
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-mono text-sm"
              placeholder="# Skill: ..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
          >
            {submitting ? '提交中...' : '提交技能'}
          </button>
        </form>
      </main>
    </div>
  )
}
