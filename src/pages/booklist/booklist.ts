import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { SearchPage } from '../search/search';
import { UserPage } from '../user/user';
import { BookinfoPage } from '../bookinfo/bookinfo';

@Component({
  selector: 'page-booklist',
  templateUrl: 'booklist.html'
})
export class BooklistPage {
  param = {
    pageSize: 15,
    pageNum: 0,
    book_cat_id: null,
    total: 0,
    more: false,
    org_id: 296
  };
  topData: any = [{
    book_cat_id: '0',
    book_cat_name: '热门图书'
  }, {
    book_cat_id: '-1',
    book_cat_name: '最新推荐'
  }]; //分类
  searchData: any = [];

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, private service: AppService) {

  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/v2/api/bookCat/getList', {
      org_id: '296'
    }).then(res => {
      console.log('分类')
      this.topData.push(...res.data);
      console.log(this.topData)
      this.getlistData(this.topData[0].book_cat_id);
    })
  }
  getlistData(book_cat_id) {
    this.param['book_cat_id'] = book_cat_id;
    this.param['pageNum'] = 0;
    this.service.loadingStart();
    this.getlistDataMore();
  }
  getlistDataMore(infiniteScroll?) {
    this.param['pageNum'] += 1;
    if (this.param.total <= this.searchData.length && this.param.total > 0 && this.param['pageNum'] > 0) {
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      this.param['more'] = true;
      this.service.loadingEnd();
      return false;
    }
    this.service.post('/v2/api/book/getList', this.param).then(res => {
      this.param['total'] = res.data.total;
      if (this.param['pageNum'] == 1) {
        this.searchData = [];
        setTimeout(() => {
          this.content.scrollToTop();
        }, 500)
      }
      this.searchData.push(...res.data.rows);
      this.service.loadingEnd();
      if (res.data.total == 0 || this.param.total <= this.searchData.length) {
        this.param['more'] = true;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      this.service.loadingEnd();
    })
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
