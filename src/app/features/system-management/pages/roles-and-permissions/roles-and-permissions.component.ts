import { Component, HostListener, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageTitleComponent } from '@/app/shared/components/layouts/page-title/page-title.component'
import { RoleLeftSideBarComponent } from '../../components/hierarchical-list/role-left-side-bar/role-left-side-bar.component'
import { ModuleAreaComponent } from '../../components/hierarchical-list/module-area/module-area.component'
import { PermissionRigthSideBarComponent } from '../../components/hierarchical-list/permission-rigth-side-bar/permission-rigth-side-bar.component'
import { TranslatePipe } from '@ngx-translate/core'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { SelectionService } from '@core/services/ui/selection.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'roles-and-permissions',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    RoleLeftSideBarComponent,
    ModuleAreaComponent,
    PermissionRigthSideBarComponent,
    TranslatePipe,
    NgbNavModule,
  ],
  templateUrl: './roles-and-permissions.component.html',
})
export class RolesAndPermissionsComponent implements OnInit {
  public activeTab: 'role' | 'module' | 'permission' = 'role'
  public selectedRoleId: number | null = null
  public selectedModuleId: number | null = null

  isSmallScreen: boolean = false

  private _selectionService = inject(SelectionService)
  private subscriptions: Subscription[] = []

  ngOnInit(): void {
    this.subscriptions.push(
      this._selectionService.selectedRoleId$.subscribe(
        (roleId) => (this.selectedRoleId = roleId)
      )
    )

    this.subscriptions.push(
      this._selectionService.selectedModuleId$.subscribe(
        (moduleId) => (this.selectedModuleId = moduleId)
      )
    )

    this.isSmallScreen = window.innerWidth <= 768
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 768
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
