import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { NewsinfoPage } from '../newsinfo/newsinfo';

@Component({
  selector: 'page-bm',
  templateUrl: 'bm.html'
})
export class BmPage {
  items: any;
  constructor(public navCtrl: NavController, private service: AppService) {
    this.service.post('/api/hbjt/memberacteglist',{
      pageNum: 1,
      pageSize: 1000,
      member_id: this.service.LoginUserInfo.member_id
    }).then(res => {
      this.items = res.data.rows;
    })
  }
  itemSelected(id?) {
    if(!id){
      this.service.dialogs.alert('数据异常','警告','确定');
    }
    this.navCtrl.push(NewsinfoPage, {
      id: id
    });
  }
}