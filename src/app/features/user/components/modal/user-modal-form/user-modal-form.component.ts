import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'user-modal-form',
  standalone: false,
  templateUrl: './user-modal-form.component.html',
})
export class UserModalFormComponent implements OnInit, OnDestroy {
  //INJECTORS
  private _formBuilder = inject(FormBuilder)

  // FORM
  public userModalForm: FormGroup | undefined = undefined

  public titleModal: string = ''

  ngOnInit(): void {
    this.userModalForm = this.getConfigUserModalForm()
  }

  private getConfigUserModalForm(): FormGroup {
    return this._formBuilder.group({})
  }

  onSubmit(): void {}

  closeModal(): void {}

  ngOnDestroy(): void {}
}
