import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChessComponent} from './chess/chess.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'game', component: ChessComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
