import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { StatsComponent } from '../components/stats/stats.component'
import { OverviewChartComponent } from '../components/overview-chart/overview-chart.component'
import { TrafficSourceComponent } from '../components/traffic-source/traffic-source.component'
import { BrandListComponent } from '../components/brand-list/brand-list.component'
import { SellingProductsComponent } from '../components/selling-products/selling-products.component'
import { EstimatedCardComponent } from '../components/estimated-card/estimated-card.component'
import { RecentOrdersComponent } from '../components/recent-orders/recent-orders.component'
import { ActivityComponent } from '../components/activity/activity.component'
import { FlatpickrDirective } from '@/app/shared/directives/flatpickr.directive'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    StatsComponent,
    OverviewChartComponent,
    TrafficSourceComponent,
    BrandListComponent,
    SellingProductsComponent,
    EstimatedCardComponent,
    RecentOrdersComponent,
    ActivityComponent,
    FlatpickrDirective,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``,
})
export class DashboardComponent {}
