import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { RoomComponent } from './pages/room/room.component';


const routes: Routes = [
  { path: '', component: CreateRoomComponent },
  { path: 'r/:room', component: RoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
