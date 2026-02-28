import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'

import { ToastrNotificationService } from '@core/services/ui/notification.service'
import Swal from 'sweetalert2'
import { Emisor } from '@core/interfaces/api/company.interface'
import { AdminCreateUserModalComponent } from '../../components/admin-create-user-modal/admin-create-user-modal.component'
import { AdminEditUserModalComponent } from '../../components/admin-edit-user-modal/admin-edit-user-modal.component'
import { User } from '@core/interfaces/api/user.interface'

@Component({
  selector: 'app-emisor-detail',
  standalone: false,
  templateUrl: './emisor-detail.component.html',
  styleUrls: ['./emisor-detail.component.scss'],
})
export class EmisorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private adminService = inject(AdminEmisorService)
  private modalService = inject(NgbModal)
  private translate = inject(TranslateService)
  private notificationService = inject(ToastrNotificationService)

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
        : { moduleKey: m.moduleKey, isActive: m.isActive }
    )

    this.emisor = { ...this.emisor, modules: updatedModules }

    this.adminService
      .updateEmisorModules(this.emisorId, { modules: updatedModules })
      .subscribe({
        next: (response) => {
          this.emisor = { ...this.emisor!, modules: response.data }
        },
        error: () => {
          this.loadEmisor()
        },
      })
  }

  onSyncInvoicing(): void {
    this.executeSyncInvoicing()
  }

  private executeSyncInvoicing(adminPassword?: string): void {
    this.isSyncing = true
    this.adminService
      .syncInvoicing(this.emisorId, adminPassword ? { adminPassword } : {})
      .subscribe({
        next: () => {
          this.isSyncing = false
          this.loadEmisor()
        },
        error: (err: Error) => {
          this.isSyncing = false
          if (err.message?.includes('contraseña del administrador')) {
            this.openSyncPasswordModal()
          } else if (err.message?.toLowerCase().includes('ya está vinculado')) {
            this.notificationService.showNotification({
              type: 'info',
              title: this.translate.instant('ADMIN.EMISOR.MODULES.TITLE'),
              message: err.message,
            })
            this.loadEmisor()
          }
        },
      })
  }

  private openSyncPasswordModal(): void {
    Swal.fire({
      title: this.translate.instant('ADMIN.EMISOR.SYNC_PASSWORD_MODAL.TITLE'),
      text: this.translate.instant('ADMIN.EMISOR.SYNC_PASSWORD_MODAL.TEXT'),
      input: 'password',
      inputPlaceholder: this.translate.instant(
        'ADMIN.EMISOR.SYNC_PASSWORD_MODAL.PLACEHOLDER'
      ),
      inputAttributes: { autocomplete: 'current-password' },
      showCancelButton: true,
      confirmButtonText: this.translate.instant(
        'ADMIN.EMISOR.SYNC_PASSWORD_MODAL.CONFIRM'
      ),
      cancelButtonText: this.translate.instant('USER.BUTTON.CANCEL'),
      confirmButtonColor: '#556ee6',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.executeSyncInvoicing(result.value as string)
      }
    })
  }

  onCreateUserRequested(): void {
    const modalRef = this.modalService.open(AdminCreateUserModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    })
    modalRef.componentInstance.emisorId = this.emisorId
    modalRef.componentInstance.emisorModules = this.emisor?.modules ?? []
    modalRef.componentInstance.userCreated.subscribe(() => {
      this.loadEmisor()
    })
  }

  onEditUserRequested(user: User): void {
    const modalRef = this.modalService.open(AdminEditUserModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    })
    modalRef.componentInstance.user = user
    modalRef.componentInstance.userUpdated.subscribe(() => {
      this.loadEmisor()
    })
  }
}
