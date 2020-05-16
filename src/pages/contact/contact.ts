import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { SearchPage } from '../search/search';
import { UserPage } from '../user/user';
import { NewsinfoPage } from '../newsinfo/newsinfo';
import { BookinfoPage } from '../bookinfo/bookinfo';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  param = {
    pageSize: 50,
    pageNum: 1,
    cat_id: null,
  };
  topData: any; //分类
  listData: any;
  pageWiper: any; //广告位
  constructor(public navCtrl: NavController, private service: AppService) {

  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/hbjt/getcats',{
      article_cat_id: '170519100316944', 
      limit: 20
    }).then(res2 => {
      console.log('分类')
      this.topData = res2.data;
      console.log(this.topData)
      this.getlistData(this.topData[0].article_cat_id);
      this.service.loadingEnd();
    })
  }
  getTopSwiper(cid){
    this.service.post('/api/hbjt/getrecommendarts', {
      article_cat_id: cid,
      limit: 5
    }).then(res => {
      console.log(res)
      this.pageWiper = res.data;
    })
  }
  getlistData(cat_id) {
    this.getTopSwiper(cat_id);
    this.param['cat_id'] = cat_id;
    this.service.post('/api/hbjt/guideList', this.param).then(res3 => {
      this.listData = res3.data.rows;
    })
  }
  toSearch() {
    this.navCtrl.push(SearchPage);
  }
  toUser() {
    this.navCtrl.push(UserPage);
  }
  toNewsinfoPage(id?){
    if(!id){
      this.service.dialogs.alert('数据异常','警告','确定');
    }
    this.navCtrl.push(NewsinfoPage, {
      id: id
    });
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
