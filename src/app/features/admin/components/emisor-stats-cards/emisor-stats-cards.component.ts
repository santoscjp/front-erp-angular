import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { AdminDashboardStats } from '@core/interfaces/api/admin.interface'

@Component({
  selector: 'app-emisor-stats-cards',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './emisor-stats-cards.component.html',
  styleUrls: ['./emisor-stats-cards.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmisorStatsCardsComponent {
  @Input() stats: AdminDashboardStats | null = null

  get topModule(): string {
    if (!this.stats?.moduleUsageCounts) return '-'
    const entries = Object.entries(this.stats.moduleUsageCounts)
    if (!entries.length) return '-'
    const sorted = entries.sort(([, a], [, b]) => b - a)
    return sorted[0][0]
  }
}
