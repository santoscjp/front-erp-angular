import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { ModuleKey } from '@/app/shared/enums/module-key.enum'
import { EmisorModule } from '@core/interfaces/api/company.interface'

@Component({
  selector: 'app-emisor-modules-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './emisor-modules-toggle.component.html',
  styleUrls: ['./emisor-modules-toggle.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmisorModulesToggleComponent {
  @Input() modules: EmisorModule[] = []
  @Input() sourceEmisorId: number | null = null
  @Input() isSyncing = false
  @Output() moduleToggled = new EventEmitter<{
    moduleKey: string
    isActive: boolean
  }>()
  @Output() syncInvoicingRequested = new EventEmitter<void>()

  moduleKeys = Object.values(ModuleKey)

  isModuleActive(moduleKey: string): boolean {
    const mod = this.modules.find((m) => m.moduleKey === moduleKey)
    return mod?.isActive ?? false
  }

  onToggle(moduleKey: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked
    this.moduleToggled.emit({ moduleKey, isActive: isChecked })
  }

  onSyncInvoicing(): void {
    this.syncInvoicingRequested.emit()
  }

  trackByModuleKey(_index: number, moduleKey: ModuleKey): string {
    return moduleKey
  }
}
