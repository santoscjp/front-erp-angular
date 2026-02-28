import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { Emisor } from '@core/interfaces/api/company.interface'
import { EmisorModulesToggleComponent } from '../../components/emisor-modules-toggle/emisor-modules-toggle.component'
import { EmisorUsersTableComponent } from '../../components/emisor-users-table/emisor-users-table.component'
import { AdminCreateUserModalComponent } from '../../components/admin-create-user-modal/admin-create-user-modal.component'

@Component({
  selector: 'app-emisor-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    EmisorModulesToggleComponent,
    EmisorUsersTableComponent,
  ],
  templateUrl: './emisor-detail.component.html',
  styleUrls: ['./emisor-detail.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmisorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private adminService = inject(AdminEmisorService)
  private modalService = inject(NgbModal)

  emisor: Emisor | null = null
  emisorId!: number
  isLoading = true
  isSyncing = false

  ngOnInit(): void {
    this.emisorId = Number(this.route.snapshot.paramMap.get('id'))
    this.loadEmisor()
  }

  private loadEmisor(): void {
    this.isLoading = true
    this.adminService.getEmisorById(this.emisorId).subscribe({
      next: (response) => {
        this.emisor = response.data
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      },
    })
  }

  onModuleToggled(event: { moduleKey: string; isActive: boolean }): void {
    if (!this.emisor?.modules) return

    const updatedModules = this.emisor.modules.map((m) =>
      m.moduleKey === event.moduleKey
        ? { moduleKey: m.moduleKey, isActive: event.isActive }
        : { moduleKey: m.moduleKey, isActive: m.isActive },
    )

    this.adminService
      .updateEmisorModules(this.emisorId, { modules: updatedModules })
      .subscribe({
        next: (response) => {
          this.emisor = response.data
        },
      })
  }

  onSyncInvoicing(): void {
    this.isSyncing = true
    this.adminService.syncInvoicing(this.emisorId).subscribe({
      next: (response) => {
        if (this.emisor) {
          this.emisor = {
            ...this.emisor,
            sourceEmisorId: response.data.sourceEmisorId,
          }
        }
        this.isSyncing = false
      },
      error: () => {
        this.isSyncing = false
      },
    })
  }

  onCreateUserRequested(): void {
    const modalRef = this.modalService.open(AdminCreateUserModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    })
    modalRef.componentInstance.emisorId = this.emisorId
    modalRef.componentInstance.userCreated.subscribe(() => {
      this.loadEmisor()
    })
  }
}
