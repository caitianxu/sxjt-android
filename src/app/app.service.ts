import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CODE_PUSH_DEPLOYMENT_KEY, IS_DEBUG } from './app.config';
import { CodePush } from '@ionic-native/code-push';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { Dialogs } from '@ionic-native/dialogs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Injectable()
export class AppService {
  platformName: string; //终端类型
  token: string; //用户token
  LoginUserInfo: any; //用户信息
  savePath: string = ''; //保存地址
  ctxPath: string; //服务器地址
  version: string; //app版本号
  version_code: number; //app版本code
  version_remark: string; //app版本功能描述
  unRefreshBookshelf: boolean = false; //是否刷新书架
  loading: any; //加载对象
  updateBookInfoReviews: boolean = false;
  book_tiger: any; //定时器
  network: any = 'wifi';
  unbarcodeScanner = false;
  txtPage: any = ["微悦读", "活动指南", "古今夷陵", "书香夷陵", "文旅地图"];
  constructor(private platform: Platform,
    public loadingCtrl: LoadingController,
    public http: Http,
    public device: Device,
    public dialogs: Dialogs,
    public barcodeScanner: BarcodeScanner,
    public statusBar: StatusBar,
    private codePush: CodePush) {
    this.ctxPath = 'http://www.tuibook.com';
  }
  /**
   * 服务初始化
   * @param callback 
   */
  init(callback?: any) {
    this.version = '1.0.0';
    this.version_code = 1;
    this.version_remark = 'APP发布!';
    this.platformName = this.device.platform ? this.device.platform.toLocaleLowerCase() : 'weixin';
    this.LoginUserInfo = JSON.parse(localStorage.getItem('LoginUserInfo'));
    this.token = this.LoginUserInfo ? this.LoginUserInfo.token : null;
    if (callback) {
      callback();
    }
  }
  loadingStart(txt?: string) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
  loadingEnd() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
  post(url: string, body?: any): Promise<any> {
    body = body ? body : {};
    console.log(url.indexOf('http://') == -1 && url.indexOf('https://') == -1)
    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
      url = this.ctxPath + url;
      body.org_id = 296;
      body.token_type = this.platformName;
      body.member_token = this.token;
      body.client_type = body.client_type ? body.client_type : 'QY';
    }
    console.log(url)
    body = this.param(body);
    console.log(body)
    //let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    //let options = new RequestOptions({headers: headers});
    this.network = 'wifi';
    let pos = this.http.post(url, body).toPromise();
    //异常就 设置为没有网络
    pos.catch(error => {
      this.network = 'none';
    })
    return pos;
  }
  param(data) {
    console.log(typeof (data))
    let url = '';
    for (const k in data) {
      const value = data[k] !== undefined ? data[k] : '';
      url += `&${k}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
  }
  getUserInfo() {
    this.post('/v2/api/mobile/memberInfo').then(success => {
      let data = success.data;
      data.pwd = this.LoginUserInfo.pwd;
      data.token = this.LoginUserInfo.token;
      this.LoginUserInfo = data;
      //存储用户信息
      localStorage.setItem('LoginUserInfo', JSON.stringify(this.LoginUserInfo));
    })
  }
  /**
   * 
   * @param callback 扫码看书
   */
  saomaAddBook(callback?) {
    if (this.unbarcodeScanner) return false;
    this.dialogs.alert('您正在使用扫码加书功能，请将摄像头对准图书二维码', '温馨提示', '确定').then(() => {
      this.unbarcodeScanner = true;
      setTimeout(() => {
        this.unbarcodeScanner = false;
      }, 3000);
      this.barcodeScanner.scan().then((success) => {
        this.unbarcodeScanner = false;
        let search = success.text.split('?')[1];
        let searchs = search.split('&');
        let param = {
          org_id: null,
          book_id: null,
          device_id: null,
          book_type: null
        }
        for (var key in searchs) {
          if (searchs[key].indexOf('o=') != -1) {
            param['org_id'] = searchs[key].replace('o=', '');
          }
          if (searchs[key].indexOf('b=') != -1) {
            param['book_id'] = searchs[key].replace('b=', '');
          }
          if (searchs[key].indexOf('d=') != -1) {
            param['device_id'] = searchs[key].replace('d=', '');
          }
          if (searchs[key].indexOf('t=') != -1) {
            param['book_type'] = searchs[key].replace('t=', '');
          }
        }
        console.log(param)
        console.log(callback)
        if (param.org_id && param.book_id && callback) {
          callback(param)
        }
      })
    })
  }
  /**
   * 网络
   */
  getNetEork(): string {
    return this.network;
  }
  /**
   * 热更新
   */
  sync() {
    if (this.isMobile()) {
      let deploymentKey = '';
      if (this.isAndroid() && IS_DEBUG) {
        deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.android.Staging;
      }
      if (this.isAndroid() && !IS_DEBUG) {
        deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.android.Production;
      }
      if (this.isIos() && IS_DEBUG) {
        deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.ios.Staging;
      }
      if (this.isIos() && !IS_DEBUG) {
        deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.ios.Production;
      }
      this.codePush.sync({
        deploymentKey
      }).subscribe(syncStatus => {
        if (syncStatus == 0) {
          console.log('已经是最新版本;');
        } else if (syncStatus == 3) {
          console.log('更新出错;');
        } else if (syncStatus == 5) {
          console.log('检查是否有更新;');
        } else if (syncStatus == 7) {
          console.log('检测到有新的版本,正在更新请稍后~');
        } else if (syncStatus == 8) {
          console.log('下载完成准备安装;');
        } else {
          this.dialogs.alert('当前有新版本可用，立即退出重新进入?', '版本更新', '确定').then(() => {
            this.platform.exitApp();
          });
        }
      });
    }
  }
  /**
* 是否真机环境
*/
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }
}