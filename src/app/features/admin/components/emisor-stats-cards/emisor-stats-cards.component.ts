import { Component, Input, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AdminDashboardStats } from '@core/interfaces/api/admin.interface'
import { MODULE_LABELS } from '@/app/shared/constants/modules.constants'
import { ModuleKey } from '@/app/shared/enums/module-key.enum'

@Component({
  selector: 'app-emisor-stats-cards',
  standalone: false,
  templateUrl: './emisor-stats-cards.component.html',
  styleUrls: ['./emisor-stats-cards.component.scss'],
})
export class EmisorStatsCardsComponent {
  @Input() stats: AdminDashboardStats | null = null

  private translate = inject(TranslateService)

  get topModule(): string {
    if (!this.stats?.moduleUsageCounts) return '-'
    const entries = Object.entries(this.stats.moduleUsageCounts)
    if (!entries.length) return '-'
    const sorted = entries.sort(([, a], [, b]) => b - a)
    const key = sorted[0][0] as ModuleKey
    const translationKey = MODULE_LABELS[key]
    return translationKey
      ? this.translate.instant(translationKey)
      : key
  }
}
