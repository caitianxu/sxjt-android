import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ShuxiangPage } from '../shuxiang/shuxiang';
import { WenlvPage } from '../wenlv/wenlv';
import { AppService } from '../../app/app.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = ShuxiangPage;
  tab5Root = WenlvPage;
  
  constructor(private service: AppService) {
    this.service.post('/api/hbjt/getappmenu', {}).then(success => {
      success.data.forEach((element, index) => {
        this.service.txtPage[index] = element.name;
      });
    })
  }
}
