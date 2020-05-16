import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { SearchPage } from '../search/search';
import { UserPage } from '../user/user';
import { NewsPage } from '../news/news';
import { NewsinfoPage } from '../newsinfo/newsinfo';
import { BookinfoPage } from '../bookinfo/bookinfo';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  param: Object = {
    pageSize: 50,
    pageNum: 1,
    type: 'news',
    pages: 0
  }
  listData: any; //列表数据
  pageWiper: Object; //广告位
  papClass: any;
  constructor(public navCtrl: NavController, private service: AppService) {}
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/hbjt/getcats', {
      article_cat_id: '170519100316947',
      limit: 4
    }).then(res => {
      console.log('分类')
      this.papClass = res.data;
      console.log(this.papClass)
    })
    this.loadPageData('news');
    this.service.post('/api/hbjt/getrecommendcms', {}).then(res => {
      this.pageWiper = res.data;
      console.log(this.pageWiper)
      this.service.loadingEnd();
    })
  }
  loadPageData(type) {
    this.param['type'] = type;
    this.service.post('/api/hbjt/getActList', this.param).then(res => {
      console.log(res)
      this.listData = res.data.rows;
    })
  }
  toSearch() {
    this.navCtrl.push(SearchPage);
  }
  toUser() {
    this.navCtrl.push(UserPage);
  }
  tonNewsInfo(cid: any, cname: any) {
    this.navCtrl.push(NewsPage, {
      cid: cid,
      cname: cname
    });
  }
  toNewsinfoPage(id?, type?) {
    if(!id){
      this.service.dialogs.alert('数据异常','警告','确定');
    }
    this.navCtrl.push(NewsinfoPage, {
      id: id,
      type: type
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
