import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  netSalary = 0
  grossSalary = ''

  firstBanner = 1045;
  secondBanner = 2089.60;
  thirdBanner = 3134.40;
  fourthBanner = 6101.06;

  constructor(public navCtrl: NavController) {
    this.calculateSalary()
  }

  calculateFirstBanner(salary) {
    return parseFloat((salary * 0.075).toFixed(2));
  }

  calculateSecondBanner(salary) {
    return parseFloat(((salary - this.firstBanner) * 0.09).toFixed(2));
  }

  calculateThirdBanner(salary) {
    return parseFloat(((salary - this.secondBanner) * 0.12).toFixed(2));
  }

  calculateFourthBanner(salary) {
    return parseFloat(((salary - this.thirdBanner) * 0.14).toFixed(2));
  }

  calculateInss() {
    const salary = parseFloat(this.grossSalary)
    let resultLast = 0
    if (salary <= this.firstBanner) {
      resultLast = this.calculateFirstBanner(salary)
    } else if (salary > this.firstBanner && salary <= this.secondBanner) {
      const first = this.calculateFirstBanner(this.firstBanner)
      resultLast = this.calculateSecondBanner(salary) + first
    } else if (salary > this.secondBanner && salary <= this.thirdBanner) {
      const first = this.calculateFirstBanner(this.firstBanner)
      const second = this.calculateSecondBanner(this.secondBanner)
      resultLast = this.calculateThirdBanner(salary) + first + second
    } else if (salary > this.thirdBanner && salary <= this.fourthBanner) {
      const first = this.calculateFirstBanner(this.firstBanner)
      const second = this.calculateSecondBanner(this.secondBanner)
      const third = this.calculateThirdBanner(this.thirdBanner)
      resultLast = this.calculateFourthBanner(salary) + first + second +third
    } else if (salary > this.fourthBanner) resultLast = 713.10;
    return resultLast;
  }

  calculateSalary() {
    console.log('grossSalary', parseFloat(this.grossSalary))
    console.log('grossSalary', this.grossSalary)
    if (!this.grossSalary) return;
    const inss = this.calculateInss()
    this.netSalary = inss;
  }
}