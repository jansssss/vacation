'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function QuestionFaq({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={item.question} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-slate-50"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            aria-expanded={openIndex === idx}
          >
            <span className="flex flex-1 items-start gap-2.5">
              <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span className="text-sm font-medium text-slate-900">{item.question}</span>
            </span>
            <ChevronDown
              className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                openIndex === idx ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === idx && (
            <div className="border-t border-slate-100 bg-slate-50 px-4 pb-4 pt-3">
              <p className="pl-7 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
