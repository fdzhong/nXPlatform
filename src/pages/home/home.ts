import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular'; 
import { FloorPage } from '../floor/Floor';
import { LocalStorage } from '../../providers/local-storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  buildings:Array<any>;
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,public localStorage: LocalStorage) {

    this.localStorage.getItem('buildings').then(
			val => this.buildings = val
    )
		//this.Buildings=["1号楼","2号楼","3号楼","4号楼","5号楼","6号楼","7号楼","8号楼","9号楼"];
  }
  
  itemSelected(item:string){
      this.navCtrl.push(FloorPage, {"buildingid":item});
  }
  
  resetclick(){

    this.localStorage.setItem("initialed",null).then(v=>{
       this.localStorage.init();
    });
    
  }

}
