import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPageComponent } from './components/stock-page/stock-page.component';

const routes: Routes = [
  {path: '', redirectTo: 'stock', pathMatch: 'full'},
  {path: 'stock', component: StockPageComponent}
  // {path: 'shopping', component: ShoppingComponent},
  // {path: 'access', component: AccessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
