import React, { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

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
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
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
          'rich-text-content min-h-[180px] w-full rounded-b-xl border border-t-0 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none',
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

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 rounded-t-xl border-b border-slate-200 bg-slate-50 px-3 py-2">
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarButtonClass(editor.isActive('heading', { level: 2 }))}
        >
          제목
        </button>
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
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolbarButtonClass(editor.isActive('blockquote'))}
        >
          인용
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
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className={toolbarButtonClass(false)}
        >
          지우기
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

