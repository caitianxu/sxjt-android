import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { SearchPage } from '../search/search';
import { UserPage } from '../user/user';
import { BooklistPage } from '../booklist/booklist';
import { VideolistPage } from '../videolist/videolist';
import { AudiolistPage } from '../audiolist/audiolist';
import { BookinfoPage } from '../bookinfo/bookinfo';
import { NewsinfoPage } from '../newsinfo/newsinfo';
import { AudioinfoPage } from '../audioinfo/audioinfo';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';

@Component({
  selector: 'page-shuxiang',
  templateUrl: 'shuxiang.html'
})
export class ShuxiangPage {
  pageWiper: any; //广告位
  hotBook: any; //热门图书
  hotVideo: any; //
  hotAudio: any; //
  constructor(public navCtrl: NavController, private streamingMedia: StreamingMedia, private service: AppService) {

  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/hbjt/getadvbycode', {
      adv_cat_code: '10001'
    }).then(res => {
      console.log(res)
      this.pageWiper = res.data;
    })
    this.service.post('/api/hbjt/getbooks', {}).then(book => {
      this.hotBook = book.data.rows;
    })
    this.service.post('/api/hbjt/getvideos	', {}).then(video => {
      this.hotVideo = video.data.rows;
    })
    this.service.post('/api/hbjt/getaudios', {}).then(audio => {
      this.hotAudio = audio.data.rows;
      this.service.loadingEnd();
    })
  }

  toSearch() {
    this.navCtrl.push(SearchPage);
  }
  toUser() {
    this.navCtrl.push(UserPage);
  }
  toBookLIst() {
    this.navCtrl.push(BooklistPage);
  }
  toVadiolistPage() {
    this.navCtrl.push(VideolistPage);
  }
  toAudiolistPage() {
    this.navCtrl.push(AudiolistPage);
  }
  toBookinfoPage(id: any) {
    this.navCtrl.push(BookinfoPage, {
      id: id
    })
  }
  toNewsinfoPage(id?) {
    if (!id) {
      this.service.dialogs.alert('数据异常', '警告', '确定');
    }
    this.navCtrl.push(NewsinfoPage, {
      id: id
    });
  }
  saomaAddBook() {
    this.service.saomaAddBook(param => {
      this.toBookinfoPage(param.book_id);
    })
  }
  toAudioinfoPage(item) {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: true
    };
    // item.video_url = 'http://61.182.139.77/6572308C544488346DE32C4ABC/03000A01005B53D004E78444080CFF1317C344-FC98-4FA9-8B98-5E1C365F2765.mp4?ccode=0519&duration=174&expire=18000&psid=fc919867a067c50528bb039339c304c5&sp=&ups_client_netip=3a1355b0&ups_ts=1532722305&ups_userid=&utid=Go%2FfE29MMEoCAToTVWEJ2ddY&vid=XMzczMTI3MjAwNA%3D%3D&vkey=B7bc523cac66f9bc47f0db915ce965b42&s=efbfbd11efbfbd2defbf';
    this.streamingMedia.playVideo(item.video_url, options);
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
  _toAudioinfoPage(item) {
    this.navCtrl.push(AudioinfoPage, item);
  }
}
