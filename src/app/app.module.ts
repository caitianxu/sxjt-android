import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//页面
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ShuxiangPage } from '../pages/shuxiang/shuxiang';
import { WenlvPage } from '../pages/wenlv/wenlv';
import { SearchPage } from '../pages/search/search';
import { UserPage } from '../pages/user/user';
import { NewsPage } from '../pages/news/news';
import { BooklistPage } from '../pages/booklist/booklist';
import { VideolistPage } from '../pages/videolist/videolist';
import { AudiolistPage } from '../pages/audiolist/audiolist';
import { NewsinfoPage } from '../pages/newsinfo/newsinfo';
import { BookinfoPage } from '../pages/bookinfo/bookinfo';
import { LoginPage } from '../pages/login/login';
import { ReadcodePage } from '../pages/readcode/readcode';
import { ScPage } from '../pages/sc/sc';
import { VaPage } from '../pages/va/va';
import { BaomingPage } from '../pages/baoming/baoming';
import { ReviewsPage } from '../pages/reviews/reviews';
import { SetingPage } from '../pages/seting/seting';
import { NickNamePage } from '../pages/nickname/nickname';
import { QianmingPage } from '../pages/qianming/qianming';
import { PhonePage } from '../pages/phone/phone';
import { EmailPage } from '../pages/email/email';
import { AudioinfoPage } from '../pages/audioinfo/audioinfo';
import { BmPage } from '../pages/bm/bm';

//插件
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from "@ionic-native/code-push";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Device } from '@ionic-native/device';
import { Dialogs } from '@ionic-native/dialogs';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { StreamingMedia } from '@ionic-native/streaming-media';

//组件
import { Http, HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { HttpService } from './http.service';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions) {
  let service = new HttpService(xhrBackend, requestOptions);
  return service;
}

@NgModule({
  declarations: [
    MyApp, HomePage, TabsPage, AboutPage, ContactPage, ShuxiangPage, WenlvPage, SearchPage, UserPage,
    NewsPage, BooklistPage, VideolistPage, AudiolistPage, NewsinfoPage, BookinfoPage, ReviewsPage, AudioinfoPage,
    LoginPage, ReadcodePage, ScPage, VaPage, BaomingPage, SetingPage, NickNamePage, QianmingPage, PhonePage, EmailPage,BmPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      pageTransition: 'ios-transition',
      backButtonText: '',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsHideOnSubPages: 'true' //隐藏全部子页面tabs
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, HomePage, TabsPage, AboutPage, ContactPage, ShuxiangPage, WenlvPage, SearchPage, UserPage,
    NewsPage, BooklistPage, VideolistPage, AudiolistPage, NewsinfoPage, BookinfoPage, ReviewsPage, AudioinfoPage,
    LoginPage, ReadcodePage, ScPage, VaPage, BaomingPage, SetingPage, NickNamePage, QianmingPage, PhonePage, EmailPage, BmPage
  ],
  providers: [
    HttpService, AppService,
    {
      provide: Http,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions]
    },
    StatusBar, BarcodeScanner, CodePush, FileTransfer,
    SplashScreen, Device, Dialogs, ImagePicker, StreamingMedia,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
