import React, { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Image } from '@tiptap/extension-image';

const toolbarButtonClass = (isActive) =>
  [
    'px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors',
    isActive
      ? 'bg-slate-900 text-white border-slate-900'
      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
  ].join(' ');

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? '내용을 입력하세요.',
      }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value ?? '',
    editorProps: {
      attributes: {
        class:
          'rich-text-content min-h-[240px] w-full rounded-b-xl border border-t-0 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none',
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange?.(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const nextValue = value ?? '';
    if (nextValue !== editor.getHTML()) {
      editor.commands.setContent(nextValue, false);
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400">
        에디터를 불러오는 중...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href ?? '';
    const url = window.prompt('링크 URL을 입력하세요', previousUrl);
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .setLink({
        href: url.trim(),
        target: '_blank',
        rel: 'noreferrer noopener',
      })
      .run();
  };

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-1.5 rounded-t-xl border-b border-slate-200 bg-slate-50 px-3 py-2">
        {/* 제목 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 1 }))}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 3 }))}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 4 }))}
        >
          H4
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* 텍스트 서식 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarButtonClass(editor.isActive('bold'))}
        >
          굵게
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarButtonClass(editor.isActive('italic'))}
        >
          기울임
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={toolbarButtonClass(editor.isActive('underline'))}
        >
          밑줄
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={toolbarButtonClass(editor.isActive('strike'))}
        >
          취소선
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* 색상 */}
        <button
          type="button"
          onClick={() => setColor('#DC2626')}
          className="px-2 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-white hover:bg-slate-50"
          style={{ color: '#DC2626' }}
        >
          빨강
        </button>
        <button
          type="button"
          onClick={() => setColor('#2563EB')}
          className="px-2 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-white hover:bg-slate-50"
          style={{ color: '#2563EB' }}
        >
          파랑
        </button>
        <button
          type="button"
          onClick={() => setColor('#16A34A')}
          className="px-2 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-white hover:bg-slate-50"
          style={{ color: '#16A34A' }}
        >
          초록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className={toolbarButtonClass(false)}
        >
          기본색
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* 정렬 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={toolbarButtonClass(editor.isActive({ textAlign: 'left' }))}
        >
          좌
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={toolbarButtonClass(editor.isActive({ textAlign: 'center' }))}
        >
          중앙
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={toolbarButtonClass(editor.isActive({ textAlign: 'right' }))}
        >
          우
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* 목록 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarButtonClass(editor.isActive('bulletList'))}
        >
          목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarButtonClass(editor.isActive('orderedList'))}
        >
          번호
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* 기타 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolbarButtonClass(editor.isActive('blockquote'))}
        >
          인용
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={toolbarButtonClass(editor.isActive('codeBlock'))}
        >
          코드
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={toolbarButtonClass(false)}
        >
          구분선
        </button>
        <button
          type="button"
          onClick={setLink}
          className={toolbarButtonClass(editor.isActive('link'))}
        >
          링크
        </button>
        <button
          type="button"
          onClick={addImage}
          className={toolbarButtonClass(false)}
        >
          이미지
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className={toolbarButtonClass(false)}
        >
          서식제거
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
