import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { NewsinfoPage } from '../newsinfo/newsinfo';
import { SearchPage } from '../search/search';
import { UserPage } from '../user/user';
import { BookinfoPage } from '../bookinfo/bookinfo';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  param = {
    pageSize: 50,
    pageNum: 1,
    cat_id: null,
  };
  cid: any;
  cname: any;
  pageWiper: any; //广告位
  listData: any;
  constructor(public navCtrl: NavController, public params: NavParams, private service: AppService) {
    this.cid = params.get('cid');
    this.cname = params.get('cname');
  }
  ionViewDidLoad() {
    this.service.post('/api/hbjt/getrecommendarts', {
      article_cat_id: this.cid,
      limit: 5
    }).then(res => {
      console.log(res)
      this.pageWiper = res.data;
    })
    this.getlistData(this.cid);
  }
  getlistData(cat_id) {
    this.param['cat_id'] = cat_id;
    this.service.post('/api/hbjt/guideList', this.param).then(res => {
      this.listData = res.data.rows;
    })
  }
  toNewsinfoPage(id?) {
    if(!id){
      this.service.dialogs.alert('数据异常','警告','确定');
    }
    this.navCtrl.push(NewsinfoPage, {
      id: id
    });
  }

  toSearch() {
    this.navCtrl.push(SearchPage);
  }
  toUser() {
    this.navCtrl.push(UserPage);
  }
  toBookinfoPage(id: any) {
    this.navCtrl.push(BookinfoPage, {
      id: id
    })
  }
  saomaAddBook(){
    this.service.saomaAddBook(param => {
      this.toBookinfoPage(param.book_id);
    })
  }
}
