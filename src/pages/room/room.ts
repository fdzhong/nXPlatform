import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LocalStorage } from '../../providers/local-storage';
import { IssuePage } from '../issue/issue';
import { IssueviewPage } from '../issueview/issueview';

@Component({
	selector: 'page-room',
	templateUrl: 'room.html',
})
export class RoomPage implements OnInit {

	buildingid: string;
	buildingname: string;
	roomid: string;
	roomname: string;
	roomInfo: any;
	dwgInfo: any;
	dwgFactor: number
	statList: any;

	constructor(public navCtrl: NavController, public navParams: NavParams,
		public localStorage: LocalStorage, public loadingCtrl: LoadingController) {
		this.roomid = navParams.get('roomid');
		let val: any;
		this.localStorage.getItem(this.roomid).then(
			val => {
				this.buildingid = val.buildingid;
				this.localStorage.getItem("buildings").then(
					v1 => {
						let buildA: Array<any>;
						buildA = v1;
						buildA.forEach(v2 => {
							if (v2.buildingid == this.buildingid)
								this.buildingname = v2.name;
						})
					})
				this.localStorage.getItem("b" + val.buildingid + "f" + val.floorid).then(
					v3 => {
						let rooms: Array<any>;
						rooms = v3;
						rooms.forEach(v4 => {
							if (v4.roomid == this.roomid)
								this.roomname = v4.name;
						});
					}
				)
			})
	}

	drawIssue(issueid: string, issue: any) {
		this.localStorage.getItem('status' + issue.status).then(
			stat => {
				let div = document.createElement('div');
				div.style.backgroundColor = stat ? stat.color : 'red';
				div.style.width = '16px';
				div.style.height = '16px';
				div.style.borderRadius = '8px';
				div.style.position = 'absolute';
				div.style.left = (issue.x / this.dwgFactor - 8) + 'px';
				div.style.top = (issue.y / this.dwgFactor - 8) + 'px';
				div.onclick = (e) => {
					e.preventDefault();
					e.stopPropagation();
					console.log(e);
					this.navCtrl.push(IssueviewPage, { roomid: this.roomid, issueid: issueid });
				}
				document.getElementById('stage').appendChild(div);
			}
		)
	}

	ionViewDidEnter() {
		this.loadRommInfo();
	}

	stageClick(e: MouseEvent) {
		var cX: number = e.offsetX * this.dwgFactor;
		var cY: number = e.offsetY * this.dwgFactor;
		var sec: string;
		if (this.dwgInfo.areas) {
			this.dwgInfo.areas.forEach(
				a => {
					if (a.left <= cX && a.top <= cY && a.right >= cX && a.bottom >= cY)
						sec = a.name;
				}
			)
		}
		// document.getElementById("clickX")['innerText'] = cX + 'px';
		// document.getElementById("clickY")['innerText'] = cY + 'px';
		// document.getElementById('statusMessage').innerText = "点击部位：" + sec;
		console.log(sec);
		this.navCtrl.push(IssuePage, { roomid: this.roomid, x: cX, y: cY, section: sec });
	}

	loadRommInfo() {
		console.log(this.roomid);
		this.localStorage.getItem(this.roomid).then(v1 => {
			this.roomInfo = v1;
			if (v1) {
				this.localStorage.getItem(this.roomInfo.drawingid).then(
					v2 => {
						this.dwgInfo = v2;
						this.dwgFactor = this.dwgInfo.width / this.stage.offsetWidth;
						this.showInfo();
					})
			} else {
				this.stage.style.backgroundImage = '';
				this.stage.style.textAlign = "center";
				this.stage.style.lineHeight = "400px";
				this.stage.innerText = '没有数据！请返回。';
			}
		})
	}

	showInfo() {
		console.log(this.roomInfo);
		console.log(this.dwgInfo);
		this.stage.style.backgroundImage = 'url(' + this.dwgInfo.src + ')';
		var issues = this.roomInfo.issues;
		issues.forEach(
			i => {
				this.localStorage.getItem('issue'+i.issueid).then(
					issue => {
						//console.log(i);
						//console.log(issue);
						this.drawIssue(i.issueid, issue);
					}
				);
			}
		)
	}

	stage: any;
	ngOnInit() {
		var stage = document.getElementById('stage');
		this.stage = stage;
		var jQuery = window['jQuery'];
		let $stage = jQuery(stage);
		var $ = window['$'];

		// create a manager for that element
		var Hammer = window['Hammer'];
		var manager = new Hammer.Manager(stage);

		// create recognizers
		var Pan = new Hammer.Pan();
		var Pinch = new Hammer.Pinch();
		// add the recognizers
		manager.add(Pan);
		manager.add(Pinch);
		// subscribe to events
		var liveScale = 1;
		var currentRotation = 0;
		manager.on('rotatemove', function (e) {
			var rotation = currentRotation + Math.round(liveScale * e.rotation);
			$.Velocity.hook($stage, 'rotateZ', rotation + 'deg');
		});
		manager.on('rotateend', function (e) {
			currentRotation += Math.round(e.rotation);
		});

		var deltaX = 0;
		var deltaY = 0;
		manager.on('panmove', function (e) {
			var dX = deltaX + (e.deltaX);
			var dY = deltaY + (e.deltaY);

			if (Math.abs(dX) < $stage.width() - 50)
				$.Velocity.hook($stage, 'translateX', dX + 'px');
			if (Math.abs(dY) < $stage.height() - 50)
				$.Velocity.hook($stage, 'translateY', dY + 'px');
		});
		manager.on('panend', function (e) {
			deltaX = deltaX + e.deltaX;
			deltaY = deltaY + e.deltaY;
		});

		// subscribe to events
		var currentScale = 1;
		function getRelativeScale(scale) {
			return scale * currentScale;
		}
		manager.on('pinchmove', function (e) {
			// do something cool
			var scale = getRelativeScale(e.scale);
			$.Velocity.hook($stage, 'scale', scale);
		});
		manager.on('pinchend', function (e) {
			// cache the scale
			currentScale = getRelativeScale(e.scale);
			liveScale = currentScale;
		});
	}

}
