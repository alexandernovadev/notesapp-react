import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Box, Paper } from '@mui/material'
import { EditorToolbar } from './EditorToolbar'

interface NoteEditorProps {
  content?: string
  onUpdate?: (content: string) => void
  placeholder?: string
  editable?: boolean
  autoFocus?: boolean
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  content = '',
  onUpdate,
  placeholder = 'Comienza a escribir...',
  editable = true,
  autoFocus = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // We'll handle history manually
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'image',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'blockquote',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'ordered-list',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable,
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML())
    },
  })

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'b':
          event.preventDefault()
          editor?.chain().focus().toggleBold().run()
          break
        case 'i':
          event.preventDefault()
          editor?.chain().focus().toggleItalic().run()
          break
        case 'u':
          event.preventDefault()
          editor?.chain().focus().toggleUnderline().run()
          break
        case 'z':
          if (event.shiftKey) {
            event.preventDefault()
            editor?.chain().focus().redo().run()
          } else {
            event.preventDefault()
            editor?.chain().focus().undo().run()
          }
          break
      }
    }
  }, [editor])

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <EditorToolbar editor={editor} />
      <Box
        sx={{
          minHeight: 400,
          maxHeight: '70vh',
          overflowY: 'auto',
          p: 2,
          '& .ProseMirror': {
            outline: 'none',
            boxShadow: (theme) => `0 0 0 1.5px ${theme.palette.divider}`,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'box-shadow 0.2s, border-color 0.2s',
          },
          '& .ProseMirror:focus': {
            outline: 'none',
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
            borderColor: 'primary.main',
          },
        }}
      >
        <EditorContent
          editor={editor}
          onKeyDown={handleKeyDown}
        />
      </Box>
    </Paper>
  )
} 