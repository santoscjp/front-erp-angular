import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { statData } from '@core/helpers/global/second-dashboard.constants'

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatsComponent {
  statData = statData
}
