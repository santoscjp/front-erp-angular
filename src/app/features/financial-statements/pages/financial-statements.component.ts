import { Component } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-financial-statements',
  standalone: false,
  template: `
    <div class="row">
      <div class="col-12">
        <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
          <div class="flex-grow-1">
            <h4 class="fs-18 fw-semibold m-0">
              {{ 'FINANCIAL_STATEMENTS.TITLE' | translate }}
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body text-center p-5">
            <i class="ti ti-chart-bar fs-1 text-muted mb-3 d-block"></i>
            <p class="text-muted mb-0">
              {{ 'WORDS.MODULE_UNDER_CONSTRUCTION' | translate }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FinancialStatementsComponent {}
