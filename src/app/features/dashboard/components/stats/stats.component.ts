import { Component } from '@angular/core'
import { statData } from '@core/helpers/global/second-dashboard.constants'
import type { StatType } from '@core/helpers/global/second-dashboard.constants'

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  statData = statData

  trackByTitle(_index: number, item: StatType): string {
    return item.title
  }
}
