import React from 'react'
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  CheckBox,
  TableChart,
  Image,
  Link,
  Undo,
  Redo,
} from '@mui/icons-material'
import { FormatUnderlined } from '@mui/icons-material'
import { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  tooltip,
  onClick,
  isActive = false,
  disabled = false,
}) => (
  <Tooltip title={tooltip} arrow>
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        p: 1,
        color: isActive ? 'primary.main' : 'text.secondary',
        backgroundColor: isActive ? 'primary.light' : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? 'primary.light' : 'action.hover',
        },
      }}
    >
      {icon}
    </IconButton>
  </Tooltip>
)

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null

  const toolbarItems = [
    // Text formatting
    {
      icon: <FormatBold fontSize="small" />,
      tooltip: 'Negrita (Ctrl+B)',
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: <FormatItalic fontSize="small" />,
      tooltip: 'Cursiva (Ctrl+I)',
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: <FormatUnderlined fontSize="small" />,
      tooltip: 'Subrayado (Ctrl+U)',
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      icon: <FormatStrikethrough fontSize="small" />,
      tooltip: 'Tachado',
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: <Code fontSize="small" />,
      tooltip: 'Código en línea',
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
  ]

  const headingItems = [
    { value: 1, label: 'H1' },
    { value: 2, label: 'H2' },
    { value: 3, label: 'H3' },
  ]

  const listItems = [
    {
      icon: <FormatListBulleted fontSize="small" />,
      tooltip: 'Lista con viñetas',
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: <FormatListNumbered fontSize="small" />,
      tooltip: 'Lista numerada',
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: <CheckBox fontSize="small" />,
      tooltip: 'Lista de tareas',
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
    },
  ]

  const blockItems = [
    {
      icon: <FormatQuote fontSize="small" />,
      tooltip: 'Cita',
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: <TableChart fontSize="small" />,
      tooltip: 'Insertar tabla',
      onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      icon: <Image fontSize="small" />,
      tooltip: 'Insertar imagen',
      onClick: () => {
        const url = window.prompt('URL de la imagen:')
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      },
    },
    {
      icon: <Link fontSize="small" />,
      tooltip: 'Insertar enlace',
      onClick: () => {
        const url = window.prompt('URL:')
        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      },
      isActive: editor.isActive('link'),
    },
  ]

  const historyItems = [
    {
      icon: <Undo fontSize="small" />,
      tooltip: 'Deshacer (Ctrl+Z)',
      onClick: () => editor.chain().focus().undo().run(),
      disabled: false,
    },
    {
      icon: <Redo fontSize="small" />,
      tooltip: 'Rehacer (Ctrl+Y)',
      onClick: () => editor.chain().focus().redo().run(),
      disabled: false,
    },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        flexWrap: 'wrap',
      }}
    >
      {/* Text formatting */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {toolbarItems.map((item, index) => (
          <ToolbarButton key={index} {...item} />
        ))}
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Headings */}
      <ToggleButtonGroup
        size="small"
        value={editor.isActive('heading', { level: 1 }) ? 1 : editor.isActive('heading', { level: 2 }) ? 2 : editor.isActive('heading', { level: 3 }) ? 3 : 0}
        exclusive
        onChange={(_, value) => {
          if (value) {
            editor.chain().focus().toggleHeading({ level: value as 1 | 2 | 3 }).run()
          } else {
            editor.chain().focus().setParagraph().run()
          }
        }}
      >
        {headingItems.map((item) => (
          <ToggleButton key={item.value} value={item.value} size="small">
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem />

      {/* Lists */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {listItems.map((item, index) => (
          <ToolbarButton key={index} {...item} />
        ))}
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Blocks */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {blockItems.map((item, index) => (
          <ToolbarButton key={index} {...item} />
        ))}
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* History */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {historyItems.map((item, index) => (
          <ToolbarButton key={index} {...item} />
        ))}
      </Box>
    </Box>
  )
} 