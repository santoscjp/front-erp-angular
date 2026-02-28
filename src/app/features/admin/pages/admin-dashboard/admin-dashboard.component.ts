import { Component, OnInit, inject } from '@angular/core'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { AdminDashboardStats } from '@core/interfaces/api/admin.interface'
import { EmisorStatsCardsComponent } from '../../components/emisor-stats-cards/emisor-stats-cards.component'

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminEmisorService)

  stats: AdminDashboardStats | null = null
  isLoading = true

  ngOnInit(): void {
    this.loadDashboardStats()
  }

  private loadDashboardStats(): void {
    this.isLoading = true
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        this.stats = response.data
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      },
    })
  }
}
