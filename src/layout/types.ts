export interface MenuItem {
  key: string
  label: string
  icon?: string
  children?: MenuItem[]
  route?: string
}

export interface LayoutState {
  collapsed: boolean
}

export interface BreadcrumbItem {
  path: string
  title: string
}
