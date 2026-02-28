import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { DashboardRoutingModule } from './dashboard-routing.module'

// Pages
import { DashboardComponent } from './pages/dashboard.component'

// Components
import { StatsComponent } from './components/stats/stats.component'
import { ActivityComponent } from './components/activity/activity.component'
import { OverviewChartComponent } from './components/overview-chart/overview-chart.component'
import { TrafficSourceComponent } from './components/traffic-source/traffic-source.component'
import { RecentOrdersComponent } from './components/recent-orders/recent-orders.component'
import { SellingProductsComponent } from './components/selling-products/selling-products.component'
import { BrandListComponent } from './components/brand-list/brand-list.component'
import { EstimatedCardComponent } from './components/estimated-card/estimated-card.component'

@NgModule({
  declarations: [
    // Pages
    DashboardComponent,

    // Components
    StatsComponent,
    ActivityComponent,
    OverviewChartComponent,
    TrafficSourceComponent,
    RecentOrdersComponent,
    SellingProductsComponent,
    BrandListComponent,
    EstimatedCardComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
