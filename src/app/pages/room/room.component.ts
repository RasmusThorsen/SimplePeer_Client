import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as SimplePeer from 'simple-peer';
import { Instance } from 'simple-peer';
import io from 'socket.io-client'

// 1: Peer1 joiner
//    - Aktiverer connection til WS
//    - Joiner et tomt rum (nul clients)
// 2: Peer2 joiner
//    - Aktiverer connection til WS
//    - Joiner et rum med en client (Peer1)
//    => createHost() bliver kaldt på Peer2
// 3: CreateHost opretter ny SimplePeer som iniatior
//    - kalder socket med "offer" event og data
// 4: SendOffer bliver aktiveret på signaling server
//    - emitter "offer" data til alle i rummet (Peer1)
// 5: CreateRemote bliver kaldt på Peer1, der opretter en SimplePeer
//    - emitter "answer" data til alle i rummet (Peer2)
// 6: HandleAnswer bliver kaldt på Peer2

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  socket = io('http://localhost:4000');
  client: {gotAnswer: boolean, peer: Instance} = {
    gotAnswer: false,
    peer: null
  }

  roomName: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    //socket events
    this.socket.on("create_host", this.createHost.bind(this));
    this.socket.on("new_offer", this.createRemote.bind(this));
    this.socket.on("new_answer", this.handleAnswer.bind(this));
    this.socket.on("end", this.end.bind(this));
    this.socket.on("session_active", this.session_active.bind(this));

    this.route.params.subscribe(s => {
      this.roomName = s.room;
      this.socket.emit('subscribe', s.room)
    });
  }

  initPeer(initiator = false): Instance {
    let peer = new SimplePeer({
      initiator,
      trickle: false
    })

    peer.on('connect', () => {
      console.log("connect called");
    })

    peer.on('error', (error) => {
      console.log("ERROR")
      console.log(error)
    })

    return peer;
  }

  createHost() {
    console.log("createHost called");
    
    this.client.gotAnswer = false;
    let peer = this.initPeer(true);
    
    peer.on("signal", data => {
      console.log("signal from host");
      console.log(data)
      if (!this.client.gotAnswer) {
        this.socket.emit("offer", this.roomName, data);
      }
    });

    peer.on('data', (data) => {
      console.log("data called");
    })
    this.client.peer = peer;
  }

  createRemote(offer) {
    console.log("createRemote called");
    
    let peer = this.initPeer();

    peer.on("signal", data => {
      console.log("signal from remote");
      console.log(data)
      
      this.socket.emit("answer", this.roomName, data);
    });

    peer.on('data', (data) => {
      console.log("data called");
    })

    peer.signal(offer);
    this.client.peer = peer;
  }

  handleAnswer(answer) {
    console.log("handleAnswer called");
    
    this.client.gotAnswer = true;
    this.client.peer.signal(answer)
  }

  end() {
    console.log("end called");
  }

  session_active() {
    console.log("session_active called");
  }

  sendData() {
    this.client.peer.send('test')
  }

}
