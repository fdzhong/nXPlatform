import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RoomPage } from '../room/room';
import { LocalStorage } from '../../providers/local-storage';
@Component({
  selector: 'page-floor',
  templateUrl: 'Floor.html'
})
export class FloorPage {
  buildingid: string;
  floors: Array<any>;
  floorsready: Array<any>;
  floorsforfix: Array<any>;
  floorsfixed: Array<any>;
  floorspass: Array<any>;
  selectedTab: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams, public localStorage: LocalStorage) {
    this.buildingid = this.params.get('buildingid');
    //this.Floors=["14","13","12","11","10","9","8","7","6","5","4","3","2","1"];
    var tFloors: Array<any>;
    var tRooms: Array<any>;
    var thouses: any;
    var tstatus: Array<any>;
    this.floors = [];
    this.floorsready = [];
    this.floorsforfix = [];
    this.floorsfixed = [];
    this.floorspass = [];
    this.selectedTab = '全部';
    this.localStorage.getItem('b' + this.buildingid).then(
      val => {
        tFloors = val;
        tFloors.forEach(v => {
          this.localStorage.getItem('b' + this.buildingid + "f" + v.floorid).then(
            val => {
              let floorready = { id: v.floorid, value: [] };
              let floorforfix = { id: v.floorid, value: [] };
              let floorfixed = { id: v.floorid, value: [] };
              let floorpass = { id: v.floorid, value: [] };
              tRooms = val;
              this.floors.push({ id: v.floorid, value: tRooms });
              tRooms.forEach(x => {
                this.localStorage.getItem('b' + this.buildingid + "f" + v.floorid + "-" + x.roomid).then(
                  val => {
                    thouses = val;
                    if (thouses == null)
                      floorready.value.push({ roomid: x.roomid, name: x.name });
                    else {
                      console.log(thouses.status);
                      if (thouses.status == "待接待")
                        floorready.value.push({ roomid: x.roomid, name: x.name });
                      else if (thouses.status == "待整改")
                        floorforfix.value.push({ roomid: x.roomid, name: x.name });
                      //this.floorsforfix.push({ id: v.floorid, value: tRooms });
                      else if (thouses.status == "已整改")
                        floorfixed.value.push({ roomid: x.roomid, name: x.name });
                      //this.floorsfixed.push({ id: v.floorid, value: tRooms });
                      else if (thouses.status == "已通过")
                        floorpass.value.push({ roomid: x.roomid, name: x.name });
                      //this.floorspass.push({ id: v.floorid, value: tRooms });                                            
                    }
                  }
                )
              })
              
              this.floorsready.push(floorready);
              this.floorsforfix.push(floorforfix);
              this.floorsfixed.push(floorfixed);
              this.floorspass.push(floorpass);
            }
          )
        });
      })
  }

  itemSelected(roomid: string) {
    this.navCtrl.push(RoomPage, { "roomid": roomid });
  }

  ionViewWillEnter() {

  }

}
