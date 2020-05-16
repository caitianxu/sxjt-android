import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { SearchPage } from '../search/search';
import { UserPage } from '../user/user';
import { BookinfoPage } from '../bookinfo/bookinfo';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';

@Component({
  selector: 'page-videolist',
  templateUrl: 'videolist.html'
})
export class VideolistPage {
  param = {
    pageSize: 10,
    pageNum: 0,
    cid: null,
    total: 0,
    more: false,
    org_id: 296
  };
  topData: any = []; //分类
  searchData: any = [];

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, private streamingMedia: StreamingMedia, private service: AppService) {

  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/hbjt/video/getVideoCats', {
      org_id: '296'
    }).then(res => {
      console.log('分类')
      this.topData.push(...res.data);
      console.log(this.topData)
      this.getlistData(this.topData[0].video_cat_id);
    })
  }
  getlistData(video_cat_id) {
    this.param['cid'] = video_cat_id;
    this.param['pageNum'] = 0;
    this.service.loadingStart();
    this.getlistDataMore();
  }
  getlistDataMore(infiniteScroll?) {
    if (this.param.total <= this.searchData.length && this.param.total > 0 && this.param['pageNum'] > 0) {
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      this.param['more'] = true;
      this.service.loadingEnd();
      return false;
    }
    this.param['pageNum'] += 1;
    this.service.post('/api/hbjt/video/getList', this.param).then(res => {
      this.param['total'] = res.data.total;
      if (this.param['pageNum'] == 1) {
        this.searchData = [];
        setTimeout(() => {
          this.content.scrollToTop();
        }, 500)
      }
      this.searchData.push(...res.data.rows);
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
  saomaAddBook() {
    this.service.saomaAddBook(param => {
      this.toBookinfoPage(param.book_id);
    })
  }

  toAudioinfoPage(item) {
    if(this.service.platformName != 'weixin'){
      let options: StreamingVideoOptions = {
        successCallback: () => { console.log('Video played') },
        errorCallback: (e) => { console.log('Error streaming') },
        orientation: 'landscape',
        shouldAutoClose: true,
        controls: true
      };
      this.streamingMedia.playVideo(item.video_url, options);
    }
    //发送播放记录
    this.service.post('/api/hbjt/searchcollect', {
      type: 1,
      member_id: this.service.LoginUserInfo.member_id,
      media_id: item.video_id
    }).then(res => {
      if (!res.data) {
        this.service.post('/api/hbjt/addcollect', {
          type: 1,
          member_id: this.service.LoginUserInfo.member_id,
          media_id: item.video_id
        }).then(res => {
          this.service.loadingEnd();
        })
      }
    })
  }
}
