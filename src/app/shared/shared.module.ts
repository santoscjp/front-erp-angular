import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { NgApexchartsModule } from 'ng-apexcharts'

import { PageTitleComponent } from './components/layouts/page-title/page-title.component'
import { TooglePanelComponent } from './components/accordions/toogle-panel/toogle-panel.component'
import { NgxDatatableComponent } from './components/tables/ngx-datatabale/ngx-datatable.component'
import { FlatpickrDirective } from './directives/flatpickr.directive'
import { HasPermissionDirective } from './directives/has-permission.directive'
import { HasModuleDirective } from './directives/has-module.directive'
import { DecimalInputDirective } from './directives/decimal-input.directive'
import { MaxCharactersDirective } from './directives/max-characters.directive'
import { OnlyAlphabetsDirective } from './directives/only-alphabets.directive'
import { OnlyNumbersWhitTwoDecimalDirective } from './directives/only-numbers-whit-two-decimal.directive'
import { OnlyNumbersDirective } from './directives/only-numbers.directive'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    NgApexchartsModule,
    PageTitleComponent,
    TooglePanelComponent,
    NgxDatatableComponent,
    FlatpickrDirective,
    HasPermissionDirective,
    HasModuleDirective,
    DecimalInputDirective,
    MaxCharactersDirective,
    OnlyAlphabetsDirective,
    OnlyNumbersWhitTwoDecimalDirective,
    OnlyNumbersDirective,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    NgApexchartsModule,
    PageTitleComponent,
    TooglePanelComponent,
    NgxDatatableComponent,
    FlatpickrDirective,
    HasPermissionDirective,
    HasModuleDirective,
    DecimalInputDirective,
    MaxCharactersDirective,
    OnlyAlphabetsDirective,
    OnlyNumbersWhitTwoDecimalDirective,
    OnlyNumbersDirective,
  ],
})
export class SharedModule {}
