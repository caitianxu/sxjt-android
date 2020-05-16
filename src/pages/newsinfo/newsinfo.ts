import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BaomingPage } from '../baoming/baoming';

@Component({
  selector: 'page-newsinfo',
  templateUrl: 'newsinfo.html'
})
export class NewsinfoPage {
  article_id: any;
  article_type: any;
  newsdata: any;
  plList: any = [];
  plparam = {
    pages: 0,
    pageSize: 10,
    pageNum: 0,
    article_id: 0,
    more: true
  }
  review_content: any;

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public params: NavParams, private service: AppService, private sanitizer: DomSanitizer) {
    this.article_id = this.plparam['article_id'] = params.get('id');
    this.article_type = params.get('type');
    console.log(this.article_type)
  }
  ionViewDidLoad() {
    this.service.post('/api/hbjt/newsdetail', {
      article_id: this.article_id
    }).then(res => {
      res.data.article_content = res.data.article_content.replace(/src=\"upload/g, 'xxx');
      res.data.article_content = this.sanitizer.bypassSecurityTrustHtml(res.data.article_content);
      this.newsdata = res.data;
      console.log(this.newsdata)
    })
    this.newsPl();
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
    this.service.post('/hbjt/articleReview/list', this.plparam).then(res => {
      console.log(res)
      this.plparam['pageNum'] = res.data.total;
      this.plList.push(...res.data.rows);
      if (this.plList.length >= res.data.total) {
        this.plparam['more'] = false;
      }
    })
  }
  navPop() {
    this.navCtrl.pop();
  }
  sendPl() {
    if (!this.review_content) {
      this.service.dialogs.alert('请填写评论内容再提交', '提示');
      return false;
    }
    this.service.post('/hbjt/articleReview/addReview', {
      article_id: this.article_id,
      review_content: this.review_content
    }).then(res => {
      this.newsPl(true);
      this.review_content = null;
      this.service.dialogs.alert('评论成功!', '提示');
      this.content.scrollToBottom();
    })
  }
  ionViewWillEnter() {
    this.service.statusBar.styleDefault();
  }
  ionViewWillLeave() {
    this.service.statusBar.styleBlackTranslucent();
  }
  toBaomingPage() {
    this.navCtrl.push(BaomingPage, {
      id: this.article_id
    })
  }
}
