import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { PERMISSIONS } from '@core/interfaces/api/permission.interface'
import { Module } from '@core/interfaces/api/module.interface'

const PERMISSION_CATEGORIES: Module[] = Object.keys(PERMISSIONS).map(
  (key, index) => ({
    id: index + 1,
    name: key.toLowerCase(),
    moduleName: key
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' '),
    description: null,
    isActive: true,
  }),
)

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  getModulesByRole(
    _roleId: number,
  ): Observable<{ data: { result: Module[] } }> {
    return of({ data: { result: [...PERMISSION_CATEGORIES] } })
  }

  findModules(params: {
    name?: string
  }): Observable<{ data: { result: Module[] } }> {
    const term = (params.name || '').toLowerCase()
    const filtered = term
      ? PERMISSION_CATEGORIES.filter((c) =>
          (c.moduleName || '').toLowerCase().includes(term),
        )
      : [...PERMISSION_CATEGORIES]
    return of({ data: { result: filtered } })
  }

  getModuleById(
    id: number,
  ): Observable<{ data: { result: Module | null } }> {
    const mod = PERMISSION_CATEGORIES.find((c) => c.id === id) || null
    return of({ data: { result: mod } })
  }

  getCategoryKeyById(id: number): string | null {
    const keys = Object.keys(PERMISSIONS)
    return keys[id - 1] || null
  }
}
