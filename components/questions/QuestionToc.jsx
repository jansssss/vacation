'use client'

import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'

export default function QuestionToc({ items }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140
      for (let i = items.length - 1; i >= 0; i -= 1) {
        const el = document.getElementById(items[i].id)
        if (el && el.offsetTop <= scrollY) {
          setActiveId(items[i].id)
          return
        }
      }
      setActiveId('')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  return (
    <nav className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-semibold text-blue-900">이 페이지에서 다루는 것</span>
      </div>
      <ol className="space-y-2">
        {items.map((item, idx) => (
          <li key={item.id} className="flex items-start gap-2">
            <span className="mt-0.5 w-5 shrink-0 font-mono text-xs text-blue-300">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <a
              href={`#${item.id}`}
              className={`text-sm leading-snug transition-colors hover:text-blue-800 ${
                activeId === item.id ? 'font-semibold text-blue-800' : 'text-blue-600'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
