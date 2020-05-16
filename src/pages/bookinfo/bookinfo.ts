import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../app/app.service';

declare let navigator: any;
declare let jQuery: any;
@Component({
  selector: 'page-bookinfo',
  templateUrl: 'bookinfo.html'
})
export class BookinfoPage {
  book_id: any;
  bookInfo: any;
  hotBook: any;
  plList: any = [];
  plparam = {
    pageNum: 0,
    pages: 1,
    total: 0,
    pageSize: 20,
    bookid: null,
    book_type: 2,
    more: true
  }
  review_content: any;
  constructor(public navCtrl: NavController, public params: NavParams, private service: AppService) {
    this.book_id = this.plparam['book_id'] = params.get('id');
  }

  ionViewDidLoad() {
    this.pageinit();
  }
  pageinit() {
    this.service.loadingStart();
    this.service.post('/api/hbjt/bookdetail', {
      bookid: this.book_id,
      member_id: this.service.LoginUserInfo.member_id
    }).then(success => {
      this.bookInfo = success.data;
      console.log(success)
      this.service.loadingEnd();
      //相关推荐
      this.service.post('/api/hbjt/bookrecommends', {
        bookid: this.book_id
      }).then(data => {
        if (data.code != 0) {
          this.service.dialogs.alert(data.message, '提示', '确定');
        }
        else {
          this.hotBook = data.data;
        }
      })
      this.newsPl(true);
    })
  }
  navPop() {
    this.navCtrl.pop();
  }
  newsPl(bool?) {
    if (bool) {
      this.plparam['pageNum'] = 1;
      this.plList = [];
      this.plparam['more'] = true;
    }
    else {
      this.plparam['pageNum'] += 1;
    }
    this.service.post('/v3/bookReview/list', this.plparam).then(res => {
      this.plparam['total'] = res.data.total;
      this.plList.push(...res.data.rows);
    })
  }
  sendPl() {
    if (!this.review_content) {
      this.service.dialogs.alert('请填写评论内容再提交', '提示');
      return false;
    }
    this.service.post('/v2/api/mobile/bookReview/addReview', {
      book_id: this.book_id,
      token_type: 'weixin',
      device_type: 'weixin',
      pid: '',
      review_content: this.review_content,
      org_id: 296
    }).then(res => {
      this.newsPl(true);
      this.review_content = null;
      this.service.dialogs.alert('评论成功!', '提示');
    })
  }
  reload(id) {
    this.book_id = this.plparam['book_id'] = id;
    this.pageinit();
  }
  addshlf() {
    this.service.post('/v2/api/bookShelf/addBook', {
      book_id: this.book_id,
      org_id: 296,
      token_type: 'weixin',
    }).then(res => {
      this.bookInfo.shelf_id = 1;
      this.service.dialogs.alert('收藏成功!', '提示');
    })
  }
  toread() {
    let options = {
      ctxPath: this.service.ctxPath.toString(),
      chid: null,
      pagenum: null,
      bookid: this.book_id.toString(),
      bookname: this.bookInfo.book_name.toString(),
      booktype: "2",
      userid: this.service.LoginUserInfo.member_id.toString(),
      token: this.service.LoginUserInfo.token.toString()
    }
    console.log(navigator.BookRead)
    navigator.BookRead.reader(options);
  }
  ionViewWillEnter() {
    this.service.statusBar.styleDefault();
    jQuery.readePageBack = (name) =>{
      this.service.statusBar.styleDefault();
    }
  }
  ionViewWillLeave() {
    this.service.statusBar.styleBlackTranslucent();
  }
}
