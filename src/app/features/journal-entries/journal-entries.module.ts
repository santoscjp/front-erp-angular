import { NgModule } from '@angular/core'
import { SharedModule } from '@/app/shared/shared.module'
import { JournalEntriesRoutingModule } from './journal-entries-routing.module'
import { JournalEntriesComponent } from './pages/journal-entries.component'

@NgModule({
  declarations: [JournalEntriesComponent],
  imports: [SharedModule, JournalEntriesRoutingModule],
})
export class JournalEntriesModule {}
