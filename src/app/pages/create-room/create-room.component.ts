import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {
  roomName = new FormControl('');
  value: string;

  constructor(private router: Router, private roomService: RoomService) { }

  onSubmit() {
    this.roomService.createRoom(this.value).pipe(
      first(),
    ).subscribe(res => console.log(res));

    this.router.navigate([`/r/${this.value}`]);
  }
}
