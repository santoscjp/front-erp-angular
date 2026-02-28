import { Component } from '@angular/core'
import { StatsComponent } from '../components/stats/stats.component'
import { OverviewChartComponent } from '../components/overview-chart/overview-chart.component'
import { TrafficSourceComponent } from '../components/traffic-source/traffic-source.component'
import { TranslateModule } from '@ngx-translate/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
