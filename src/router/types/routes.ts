// Types for the new routing system

export interface RouteConfig {
  path: string
  element: React.LazyExoticComponent<() => JSX.Element>
  title: string
  icon?: string
  protected?: boolean
  children?: RouteConfig[]
}

export interface AppRoute {
  path: string
  component: React.LazyExoticComponent<() => JSX.Element>
  exact?: boolean
  protected?: boolean
}

// Route names for type safety
export type RouteName = 
  | 'dashboard'
  | 'notes'
  | 'note-detail'
  | 'note-new'
  | 'search'
  | 'favorites'
  | 'trash'
  | 'settings'
  | 'settings-profile'
  | 'settings-account'
  | 'settings-theme'
  | 'settings-backup'
  | 'login'
  | 'register'
  | 'forgot-password'

// Navigation items for sidebar
export interface NavigationItem {
  id: RouteName
  label: string
  path: string
  icon: string
  badge?: number
  children?: NavigationItem[]
}

// Layout types
export type LayoutType = 'dashboard' | 'editor' | 'auth' | 'minimal' 