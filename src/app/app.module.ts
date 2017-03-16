import 'hammerjs';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Md2Module }  from 'md2';
import { OrdersService } from './services/orders.service';

@NgModule({
  imports: [
    Ng2SmartTableModule,
    Md2Module.forRoot(),
    BrowserModule,
    FormsModule,
    MaterialModule.forRoot(),
  ],
  declarations: [AppComponent],
  entryComponents: [],
  bootstrap: [AppComponent],
  providers: [OrdersService]
})
export class AppModule {}