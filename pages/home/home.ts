import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  netSalary = 0
  grossSalary = ''
  plan = ''
  food = ''
  otherDiscounts = ''
  numberDependents
  reduceDependents = 189.59;

  firstBanner = 1045;
  secondBanner = 2089.60;
  thirdBanner = 3134.40;
  fourthBanner = 6101.06;

  irrf = [
    {
      calc: 1903.98,
      percentage: 0,
      reduce: 0
    },
    {
      calc: 2826.65,
      percentage: 0.075,
      reduce: 142.80
    },
    {
      calc: 3751.05,
      percentage: 0.15,
      reduce: 142.80
    },
    {
      calc: 4664.68,
      percentage: 0.225,
      reduce: 636.13
    },
    {
      calc: 4664.69,
      percentage: 0.275,
      reduce: 869.36
    }
  ]

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
      resultLast = this.calculateFourthBanner(salary) + first + second + third
    } else if (salary > this.fourthBanner) resultLast = 713.10;
    return resultLast;
  }

  calculateDependents(salary) {
    const numberDependents = this.numberDependents >= 0 ? this.numberDependents : 0
    const reduce = numberDependents * this.reduceDependents
    return parseFloat((salary - reduce).toFixed(2));
  }

  calculateLastIrrf(salary, percentage, reduce) {
    return parseFloat(((salary * percentage) - reduce).toFixed(2));
  }

  calculateIrrf(salary) {
    let resultLast = 0
    if (this.numberDependents) salary = this.calculateDependents(salary);
    this.irrf.map((e, index) => {
      if (!index) {
        if (salary <= e.calc) resultLast = this.calculateLastIrrf(salary, e.percentage, e.reduce)
      } else if (salary > this.irrf[--index].calc && salary <= e.calc) {
        resultLast = this.calculateLastIrrf(salary, e.percentage, e.reduce)
      } else if (this.irrf.length -1 === index && salary > e.calc) {
        resultLast = this.calculateLastIrrf(salary, e.percentage, e.reduce)
      }
    })
    return resultLast
  }

  calculateSalary() {
    if (!this.grossSalary) return;
    let salary = parseFloat(this.grossSalary)
    const inss = this.calculateInss()
    salary -= inss
    const irrf = this.calculateIrrf(salary)
    salary -= irrf
    salary -= this.plan ? parseFloat(this.plan) : 0
    salary -= this.food ? parseFloat(this.food) : 0
    salary -= this.otherDiscounts ? parseFloat(this.otherDiscounts) : 0
    this.netSalary = parseFloat(salary.toFixed(2))
  }
}