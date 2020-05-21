import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'details.html'
})

export class DetailsPage {
  details;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.details = this.params.data
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}