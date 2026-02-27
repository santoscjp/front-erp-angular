export type MenuItemType = {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: {
    variant: string
    text: string
  }
  parentKey?: string
  isDisabled?: boolean
  collapsed?: boolean
  children?: MenuItemType[]
}

export type SubMenus = {
  item: MenuItemType
  linkClassName?: string
  subMenuClassName?: string
  activeMenuItems?: Array<string>
  toggleMenu?: (item: MenuItemType, status: boolean) => void
  className?: string
}

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'RESUME',
    label: 'RESUME',
    isTitle: true,
  },
  {
    key: 'DASHBOARD',
    label: 'DASHBOARD',
    icon: 'ti-dashboard',
    url: '/dashboard',
  },
  {
    key: 'USERS_MANAGEMENT',
    label: 'USERS_MANAGEMENT',
    isTitle: true,
  },
  {
    key: 'USERS',
    label: 'USERS',
    icon: 'ti-user',
    url: '/users-management/users',
  },
  {
    key: 'SYSTEM_MANAGEMENT',
    label: 'SYSTEM_MANAGEMENT',
    isTitle: true,
  },
  {
    key: 'ROLES_AND_PERMISSIONS',
    label: 'ROLES_AND_PERMISSIONS',
    icon: 'ti-user-shield',
    url: '/system-management/roles-and-permissions',
  },
]

export const HORIZONTAL_MENU_ITEM: MenuItemType[] = [
  {
    key: 'dashboards',
    label: 'Dashboards',
    icon: 'ti-dashboard',
    children: [
      {
        key: 'sales',
        label: 'Sales',
        url: '/dashboards/sales',
        parentKey: 'dashboards',
      },
      {
        key: 'clinic',
        label: 'Clinic',
        url: '/dashboards/clinic',
        parentKey: 'dashboards',
      },
      {
        key: 'wallet',
        label: 'eWallet',
        url: '/dashboards/wallet',
        parentKey: 'dashboards',
      },
    ],
  },
]
