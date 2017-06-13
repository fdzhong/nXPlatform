import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalStorage } from '../../providers/local-storage';
@Component({
	selector: 'page-issueview',
	templateUrl: 'issueview.html'
})
export class IssueviewPage {
	titlename: string;
	section: string;
	checkitem: string;
	itdesc: string;
	descplus: string;
	uglevel: string;
	vend: string;
	resunit: string;
	images: Array<string>;
	imagesfixed: Array<string>;
	imagesadd:Array<string>;
	registertime: string;
	duetime: string;
	fixtime: string;
	hidden: boolean;
	arrow: string;
	issueid: string;
	roodid: string;
	constructor(public localStorage: LocalStorage, private camera: Camera, public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams) {
		this.images = [];
		this.imagesfixed = [];
		this.hidden = true;
		this.arrow = "∨";
		this.roodid = this.params.get('roomid');
		let val: any;
		this.localStorage.getItem(this.roodid).then(
			val => {
				this.localStorage.getItem(val.drawingid).then(
					v1 => {						
						this.localStorage.getItem("b" + val.buildingid + "f" + val.floorid).then(
							v => {
								let rooms: Array<any>;
								rooms = v;
								rooms.forEach(v2 => {
									if (v2.roomid == this.roodid)
										this.titlename = v2.name;
								});
							}
						)
					})
			})		
		this.issueid = this.params.get('issueid');
		let issuelist: any;
		this.localStorage.getItem('issue'+this.issueid).then(
			v => {
				issuelist = v;
				this.section = issuelist.sections;
				this.checkitem = issuelist.checkitem;
				this.itdesc = issuelist.itdesc;
				this.descplus = issuelist.descplus;
				this.uglevel = issuelist.uglevel;
				this.vend = issuelist.vend;
				this.resunit = issuelist.responsibility;
				this.registertime = issuelist.registertime;
				this.duetime = issuelist.duetime;
				this.fixtime = issuelist.fixtime;
				this.images = issuelist.imgssumbit;
				this.imagesfixed = issuelist.imgsfix;
				let status:number;
				status = issuelist.status;
				if (status == 4 || status == 9)
				{
					document.getElementById("actionbtn").hidden = true;
				}
			})
		//var now = new Date();
		//this.registertime=now.toLocaleDateString()+"  "+now.toLocaleTimeString();
	}

	itemchange() {

	}

	plusinfo() {
		document.getElementById("plusinfo").hidden = !document.getElementById("plusinfo").hidden;
		if (document.getElementById("plusinfo").hidden)
			this.arrow = "∨";
		else
			this.arrow = "∧";
	}
	cameraclick() {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}
		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			this.imagesfixed.push('data:image/jpeg;base64,' + imageData);
			this.imagesadd.push('data:image/jpeg;base64,' + imageData);			
		}, (err) => {
			// Handle error
		});
	}

	ionViewWillEnter() {

	}

	passclick() {
		let now = new Date();	
		let imgss = [];
		this.imagesadd.forEach(val => {
			let keystr = "img_s" + now.toTimeString + Math.random().toString();
			this.localStorage.setItem(keystr, val);
			imgss.push(keystr);
		})	
		let issuelist: any;		
		this.localStorage.getItem(this.issueid).then(
			val => {
				issuelist = val;
				issuelist.status = 4;
				issuelist.imagesfix = imgss;
				//issuelist.push({passtime:now.toLocaleDateString() + "  " + now.toLocaleTimeString()});
				// this.localStorage.removeitem(this.issueid);
				this.localStorage.setItem(this.issueid,issuelist);
				this.navCtrl.pop();				
			})
       
	}

    rejectclick() {
		let now = new Date();		
		let issuelist: any;		
		this.localStorage.getItem(this.issueid).then(
			val => {
				issuelist = val;
				issuelist.status = 2;
				//issuelist.imgsfix = [];		
				//this.localStorage.removeitem(this.issueid);
				this.localStorage.setItem(this.issueid,issuelist);
				this.navCtrl.pop();		
			})
        
	}

	closedclick() {
		let now = new Date();		
		let issuelist: any;		
		this.localStorage.getItem(this.issueid).then(
			val => {
				issuelist = val;
				issuelist.status = 9;		
				//this.localStorage.removeitem(this.issueid);
				this.localStorage.setItem(this.issueid,issuelist);
				this.navCtrl.pop();		
			})
        
	}
}
