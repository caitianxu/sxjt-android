import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { LoginPage } from '../login/login';
import { ReadcodePage } from '../readcode/readcode';
import { ScPage } from '../sc/sc';
import { VaPage } from '../va/va';
import { SetingPage } from '../seting/seting';
import { ReviewsPage } from '../reviews/reviews';
import { BmPage } from '../bm/bm';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  convertData = {
    today: 0,
    total: 0,
    book: 0,
    order: 0,
    comments: 0
  }
  constructor(public navCtrl: NavController, private service: AppService) {

  }
  ionViewDidLoad() {
    console.log(this.service.LoginUserInfo)
  }
  tologin() {
    this.navCtrl.push(LoginPage);
  }
  ionViewWillEnter() {
    this.service.post('/v2/api/member/readCount').then(res => {
      console.log(res)
      this.convertData['today'] = res.data.todayTime;
      this.convertData['total'] = res.data.allTime;
      this.convertData['book'] = res.data.bookNums;
      this.convertData['order'] = res.data.rank;
      this.convertData['comments'] = res.data.reviewNum;
    })
  }
  toReadCode() {
    this.navCtrl.push(ReadcodePage);
  }
  tosc() {
    this.navCtrl.push(ScPage);
  }
  tova() {
    this.navCtrl.push(VaPage);
  }
  //前往设置
  to_seting() {
    if (this.service.getNetEork()  == 'none') {
      this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
      return false;
    }
    this.navCtrl.push(SetingPage);
  }
  //评论列表
  toReviews() {
    if (this.service.getNetEork()  == 'none') {
      this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
      return false;
    }
    this.navCtrl.push(ReviewsPage);
  }
  //报名记录
  baoming(){
    this.navCtrl.push(BmPage)
  }
}
