import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ColumnMode } from '@swimlane/ngx-datatable'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { User } from '@core/interfaces/api/user.interface'

@Component({
  selector: 'app-emisor-users-table',
  standalone: false,
  templateUrl: './emisor-users-table.component.html',
  styleUrls: ['./emisor-users-table.component.scss'],
})
export class EmisorUsersTableComponent implements OnInit, OnChanges {
  @Input() emisorId!: number
  @Output() createUserRequested = new EventEmitter<void>()
  @Output() editUserRequested = new EventEmitter<User>()
  @Output() unlockUserRequested = new EventEmitter<User>()

  @ViewChild('roleTpl', { static: true }) roleTpl!: TemplateRef<unknown>
  @ViewChild('sourceTpl', { static: true }) sourceTpl!: TemplateRef<unknown>
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<unknown>
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<unknown>

  private adminService = inject(AdminEmisorService)
  private translate = inject(TranslateService)

  users: User[] = []
  columns: unknown[] = []
  columnMode = ColumnMode.force
  isLoading = false

  ngOnInit(): void {
    this.initColumns()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['emisorId'] && this.emisorId) {
      this.loadUsers()
    }
  }

  private initColumns(): void {
    this.columns = [
      {
        name: this.translate.instant('USER.TABLE.USERNAME'),
        prop: 'username',
        cellClass: 'col-username',
      },
      {
        name: this.translate.instant('WORDS.FIRST_NAME'),
        prop: 'firstName',
        cellClass: 'col-first-name',
      },
      {
        name: this.translate.instant('WORDS.LAST_NAME'),
        prop: 'lastName',
        cellClass: 'col-last-name',
      },
      {
        name: this.translate.instant('USER.TABLE.EMAIL'),
        prop: 'email',
        width: 250,
        cellClass: 'col-email',
      },
      {
        name: this.translate.instant('USER.TABLE.ROLES'),
        cellTemplate: this.roleTpl,
        width: 150,
        cellClass: 'col-role',
      },
      {
        name: 'Source',
        cellTemplate: this.sourceTpl,
        width: 120,
        cellClass: 'col-source',
      },
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.STATUS'),
        cellTemplate: this.statusTpl,
        width: 100,
        cellClass: 'col-status',
      },
      {
        name: this.translate.instant('USER.TABLE.ACTIONS'),
        cellTemplate: this.actionsTpl,
        width: 80,
        sortable: false,
        cellClass: 'col-actions',
      },
    ]
  }

  loadUsers(): void {
    this.isLoading = true
    this.adminService.getEmisorUsers(this.emisorId, {}).subscribe({
      next: (response) => {
        this.users = response.data.result
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      },
    })
  }

  onCreateUser(): void {
    this.createUserRequested.emit()
  }

  onEditUser(user: User): void {
    this.editUserRequested.emit(user)
  }

  onUnlockUser(user: User): void {
    this.unlockUserRequested.emit(user)
  }

  isUserLocked(user: User): boolean {
    return user.lockedUntil !== null
  }

  trackByUserId(_index: number, user: User): number {
    return user.id
  }
}
