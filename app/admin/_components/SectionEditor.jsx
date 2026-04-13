'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import { useEffect, useState } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, List, ListOrdered,
  Quote, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Highlighter, Undo, Redo, Code2,
} from 'lucide-react'
import './editor.css'

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-slate-800 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

export default function SectionEditor({ value, onChange }) {
  const [mode, setMode] = useState('visual') // 'visual' | 'html' | 'preview'
  const [htmlValue, setHtmlValue] = useState(value || '')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlValue(html)
      onChange(html)
    },
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 text-sm text-slate-800' },
    },
  })

  // 외부 value 변경 시 동기화 (초기 로드)
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
      setHtmlValue(value || '')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  const addLink = () => {
    const url = window.prompt('URL을 입력하세요')
    if (url && editor) editor.chain().focus().setLink({ href: url }).run()
  }

  const handleHtmlChange = (e) => {
    const v = e.target.value
    setHtmlValue(v)
    onChange(v)
  }

  const switchMode = (next) => {
    if (mode === 'html' && next !== 'html' && editor) {
      // HTML → visual: 에디터에 반영
      editor.commands.setContent(htmlValue || '')
    }
    if (mode === 'visual' && next === 'html' && editor) {
      // visual → HTML: 최신 HTML 반영
      setHtmlValue(editor.getHTML())
    }
    setMode(next)
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* 모드 탭 */}
      <div className="flex items-center gap-1 px-3 pt-2 border-b border-slate-100 bg-slate-50">
        {[
          { key: 'visual', label: '편집' },
          { key: 'html', label: 'HTML' },
          { key: 'preview', label: '미리보기' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => switchMode(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
              mode === key
                ? 'bg-white border border-b-white border-slate-200 text-slate-900 -mb-px'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 편집 모드 */}
      {mode === 'visual' && editor && (
        <>
          {/* 툴바 */}
          <div className="flex flex-wrap gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50">
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="실행 취소"><Undo className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="다시 실행"><Redo className="h-3.5 w-3.5" /></ToolbarBtn>
            <div className="w-px bg-slate-200 mx-1" />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게"><Bold className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임"><Italic className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="밑줄"><UnderlineIcon className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="취소선"><Strikethrough className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="형광펜"><Highlighter className="h-3.5 w-3.5" /></ToolbarBtn>
            <div className="w-px bg-slate-200 mx-1" />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="제목 2"><Heading2 className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="제목 3"><Heading3 className="h-3.5 w-3.5" /></ToolbarBtn>
            <div className="w-px bg-slate-200 mx-1" />
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="왼쪽 정렬"><AlignLeft className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="가운데 정렬"><AlignCenter className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="오른쪽 정렬"><AlignRight className="h-3.5 w-3.5" /></ToolbarBtn>
            <div className="w-px bg-slate-200 mx-1" />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="글머리 기호"><List className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="번호 매기기"><ListOrdered className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="인용구"><Quote className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="코드"><Code2 className="h-3.5 w-3.5" /></ToolbarBtn>
            <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="링크"><LinkIcon className="h-3.5 w-3.5" /></ToolbarBtn>
          </div>
          <EditorContent editor={editor} />
        </>
      )}

      {/* HTML 모드 */}
      {mode === 'html' && (
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          rows={12}
          className="w-full px-4 py-3 text-xs font-mono text-slate-700 focus:outline-none resize-y bg-white"
          placeholder="HTML을 직접 입력하세요"
          spellCheck={false}
        />
      )}

      {/* 미리보기 모드 */}
      {mode === 'preview' && (
        <div
          className="p-4 text-sm text-slate-800 prose prose-sm max-w-none min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: htmlValue }}
        />
      )}
    </div>
  )
}
