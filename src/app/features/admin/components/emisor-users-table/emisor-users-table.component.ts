import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  CUSTOM_ELEMENTS_SCHEMA,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable'
import { AdminEmisorService } from '@core/services/api/admin-emisor.service'
import { User } from '@core/interfaces/api/user.interface'
import { inject } from '@angular/core'

@Component({
  selector: 'app-emisor-users-table',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgxDatatableModule],
  templateUrl: './emisor-users-table.component.html',
  styleUrls: ['./emisor-users-table.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmisorUsersTableComponent implements OnInit, OnChanges {
  @Input() emisorId!: number
  @Output() createUserRequested = new EventEmitter<void>()

  @ViewChild('roleTpl', { static: true }) roleTpl!: TemplateRef<unknown>
  @ViewChild('sourceTpl', { static: true }) sourceTpl!: TemplateRef<unknown>
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<unknown>

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
      },
      {
        name: this.translate.instant('WORDS.FIRST_NAME'),
        prop: 'firstName',
      },
      {
        name: this.translate.instant('WORDS.LAST_NAME'),
        prop: 'lastName',
      },
      {
        name: this.translate.instant('USER.TABLE.EMAIL'),
        prop: 'email',
        width: 250,
      },
      {
        name: this.translate.instant('USER.TABLE.ROLES'),
        cellTemplate: this.roleTpl,
        width: 150,
      },
      {
        name: 'Source',
        cellTemplate: this.sourceTpl,
        width: 120,
      },
      {
        name: this.translate.instant('ADMIN.EMISOR.TABLE.STATUS'),
        cellTemplate: this.statusTpl,
        width: 100,
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

  trackByUserId(_index: number, user: User): number {
    return user.id
  }
}
