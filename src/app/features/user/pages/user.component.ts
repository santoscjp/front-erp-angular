import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule } from '@ngx-translate/core'
import { UserFilterFormComponent } from '../components/filter/user-filter-form/user-filter-form.component'
import { TableUserComponent } from '../components/tables/table-user/table-user.component'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbModule, TableUserComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserComponent {}
