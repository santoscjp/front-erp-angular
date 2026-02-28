import { Component } from '@angular/core'
import { reportGroupsData } from '@core/helpers/global/second-dashboard.constants'
import type { ReportGroupType } from '@core/helpers/global/second-dashboard.constants'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'traffic-source',
  standalone: false,
  templateUrl: './traffic-source.component.html',
  styleUrls: ['./traffic-source.component.scss'],
})
export class TrafficSourceComponent {
  reportGroups = reportGroupsData

  trackByTitle(_index: number, item: ReportGroupType): string {
    return item.title
  }
}
