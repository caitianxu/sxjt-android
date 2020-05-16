import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../app/app.service';

@Component({
  selector: 'page-baoming',
  templateUrl: 'baoming.html'
})
export class BaomingPage {
  userName: any;
  phone: any;
  param = {
    activity_id: 0,
    member_id: 0,
    org_id: 296,
    member_name: 0,
    phone: 0,
    clinet_type: 'QY',
  }
  constructor(public navCtrl: NavController, private service: AppService, private params: NavParams) {
    this.param['activity_id'] = this.params.get('id');
    this.param['member_id'] = this.service.LoginUserInfo.member_id;
  }
  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    this.userName = null;
    this.phone = null;
  }
  tologin() {
    if (this.userName && this.phone) {
      this.param['member_name'] = this.userName;
      this.param['phone'] = this.phone;
      this.service.post('/api/hbjt/actReg', this.param).then(success => {
        if (success.code == 0) {
          this.service.dialogs.alert('报名成功!', '提示');
          this.navCtrl.pop();
        }
        else {
          this.service.dialogs.alert(success.message, '提示');
        }
      })
    }
    else {
      this.service.dialogs.alert('请完整填写你的姓名和联系方式', '提示');
    }
  }
}
