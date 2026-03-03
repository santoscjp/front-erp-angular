import { Injectable } from '@angular/core'
import { type MenuItemType } from '@core/helpers/ui/menu-meta'

@Injectable({
  providedIn: 'root',
})
export class SidebarMenuService {
  filterMenu(
    items: MenuItemType[],
    permissions: string[],
    modules: string[],
  ): MenuItemType[] {
    const hasAll = permissions.includes('all')

    const filteredItems = items.map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          this.isItemVisible(child, permissions, modules, hasAll),
        )
        if (filteredChildren.length === 0) return null
        return { ...item, children: filteredChildren }
      }
      if (item.isTitle) return item
      if (!this.isItemVisible(item, permissions, modules, hasAll)) return null
      return item
    })

    const result: MenuItemType[] = []
    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i]
      if (!item) continue

      if (item.isTitle) {
        let hasVisibleChild = false
        for (let j = i + 1; j < filteredItems.length; j++) {
          if (filteredItems[j]?.isTitle) break
          if (filteredItems[j]) {
            hasVisibleChild = true
            break
          }
        }
        if (hasVisibleChild) result.push(item)
      } else {
        result.push(item)
      }
    }

    return result
  }

  private isItemVisible(
    item: MenuItemType,
    permissions: string[],
    modules: string[],
    hasAllPermissions: boolean,
  ): boolean {
    if (item.module && !modules.includes(item.module)) return false
    if (item.permission) {
      return hasAllPermissions || permissions.includes(item.permission)
    }
    return true
  }
}
