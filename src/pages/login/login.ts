import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  userName: any;
  passWord: any;
  constructor(public navCtrl: NavController, private service: AppService) {

  }
  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    this.userName = null;
    this.passWord = null;
  }
  tologin() {
    if (this.userName && this.passWord) {
      var ps = {
        account: this.userName,
        pwd: this.passWord,
        token_type: 'weixin',
        org_id: 296,
        clinet_type: 'QY'
      }
      var param = {
        account: this.userName,
        pwd: this.passWord
      }
      // this.service.post('http://cjszyun.cn/api/hbjt/login', ps).then(success => {
      this.service.post('/v2/api/mobile/login', param).then(success => {
        console.log(success)
        if (success.code == 0) {
          this.service.LoginUserInfo = success.data;
          this.service.LoginUserInfo.pwd = this.passWord;
          this.service.LoginUserInfo.icon = success.data.icon == '' ? '/static/mobile/img/touxiang.png' : success.data.icon;
          this.service.token = success.data.token;
          //存储用户信息
          localStorage.setItem('LoginUserInfo', JSON.stringify(this.service.LoginUserInfo));
          this.service.unRefreshBookshelf = true;
          this.navCtrl.pop();
        }
        else {
          this.service.dialogs.alert(success.message,'提示');
        }
      })
    }
    else {
      this.service.dialogs.alert('请完整输入账号和密码','提示');
    }
  }
}
