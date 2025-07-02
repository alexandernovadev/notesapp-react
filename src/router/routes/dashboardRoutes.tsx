import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '@/router/layouts/DashboardLayout'
import { AuthGuard } from '@/router/guards/AuthGuard'

// Lazy load pages
const DashboardPage = React.lazy(() => 
  import('@/router/pages/dashboard/DashboardPage').then(module => ({
    default: module.DashboardPage
  }))
)

const NoteEditorPage = React.lazy(() => 
  import('@/router/pages/editor/NoteEditorPage').then(module => ({
    default: module.NoteEditorPage
  }))
)

const SearchPage = React.lazy(() => 
  import('@/router/pages/search/SearchPage').then(module => ({
    default: module.SearchPage
  }))
)

const FavoritesPage = React.lazy(() => 
  import('@/router/pages/favorites/FavoritesPage').then(module => ({
    default: module.FavoritesPage
  }))
)

const TrashPage = React.lazy(() => 
  import('@/router/pages/trash/TrashPage').then(module => ({
    default: module.TrashPage
  }))
)

const SettingsPage = React.lazy(() => 
  import('@/router/pages/settings/SettingsPage').then(module => ({
    default: module.SettingsPage
  }))
)

export const DashboardRoutes: React.FC = () => {
  return (
    <AuthGuard>
      <Routes>
        <Route element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />
          
          {/* Notes */}
          <Route path="notes">
            <Route path="new" element={<NoteEditorPage />} />
            <Route path=":id" element={<NoteEditorPage />} />
          </Route>
          
          {/* Search */}
          <Route path="search" element={<SearchPage />} />
          
          {/* Favorites */}
          <Route path="favorites" element={<FavoritesPage />} />
          
          {/* Trash */}
          <Route path="trash" element={<TrashPage />} />
          
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/*" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthGuard>
  )
} 