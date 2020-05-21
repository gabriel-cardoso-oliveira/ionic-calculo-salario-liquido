import { Component } from '@angular/core';
import {
  NavController,
  ModalController
} from 'ionic-angular';
import { DetailsPage } from './../details/details';

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
  maxForesight = 713.10;
  banners = []
  planEnd = 0
  foodEnd = 0
  discountsEnd = 0
  inssEnd = 0
  irrfEnd = 0

  inss = [
    {
      calc: 1045,
      percentage: 0.075
    },
    {
      calc: 2089.60,
      percentage: 0.09
    },
    {
      calc: 3134.40,
      percentage: 0.12
    },
    {
      calc: 6101.06,
      percentage: 0.14
    }
  ]

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

  detailsSalary = {
    salary: 0,
    description: 'Salário Líquido Mensal',
    color: 'green',
    items: []
  }

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.calculateSalary()
    this.calculateSalaryRange()
  }

  fillDetails(title, note, color) {
    this.detailsSalary.items.push({
      title,
      note,
      color
    })
  }

  openModal() {
    if (!this.grossSalary) return;
    this.detailsSalary.items = []
    this.detailsSalary.salary = this.netSalary
    this.fillDetails(this.grossSalary, 'Salário Bruto', 'blue')
    this.fillDetails(`- R$${this.inssEnd}`, 'INSS', 'red')
    this.fillDetails(`- R$${this.irrfEnd}`, 'IRRF', 'red')
    this.fillDetails(`- R$${this.planEnd}`, 'Plano de Saúde', 'red')
    this.fillDetails(`- R$${this.foodEnd}`, 'Alimentação', 'red')
    this.fillDetails(`- R$${this.discountsEnd}`, 'Outros Descontos', 'red')
    const modal = this.modalCtrl.create(DetailsPage, this.detailsSalary)
    modal.present()
  }

  calculateBanner(salary, reduce, percentage) {
    return parseFloat(((salary - reduce) * percentage).toFixed(2))
  }

  calculateSalaryRange() {
    this.inss.map((e, index) => {
      if (!index) this.banners.push(parseFloat((e.calc * e.percentage).toFixed(2)))
      else if (index < this.inss.length -1) {
        this.banners.push(this.calculateBanner(e.calc, this.inss[--index].calc, e.percentage))
      }
    })
  }

  calculateInss(salary) {
    let resultLast = 0
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    this.inss.map((e, index) => {
      const count = index
      if (!index) {
        if (salary <= e.calc) resultLast = parseFloat((salary * e.percentage).toFixed(2));
      } else if (salary > this.inss[--index].calc && salary <= e.calc) {
        const banners = this.banners.filter((v, key) => index >= key)
        const calc = this.calculateBanner(salary, this.inss[index].calc, e.percentage)
        resultLast = parseFloat(banners.reduce(reducer, calc).toFixed(2))
      } else if (this.inss.length -1 === count && salary > e.calc) resultLast = this.maxForesight;
    })
    return resultLast
  }

  calculateDependents(salary) {
    const reduce = this.numberDependents * this.reduceDependents
    return parseFloat((salary - reduce).toFixed(2));
  }

  calculateLastIrrf(salary, percentage, reduce) {
    return parseFloat(((salary * percentage) - reduce).toFixed(2));
  }

  calculateIrrf(salary) {
    let resultLast = 0
    if (this.numberDependents) salary = this.calculateDependents(salary);
    this.irrf.map((e, index) => {
      const count = index
      if (!index) {
        if (salary <= e.calc) resultLast = this.calculateLastIrrf(salary, e.percentage, e.reduce)
      } else if (salary > this.irrf[--index].calc && salary <= e.calc) {
        resultLast = this.calculateLastIrrf(salary, e.percentage, e.reduce)
      } else if (this.irrf.length -1 === count && salary > e.calc) {
        resultLast = this.calculateLastIrrf(salary, e.percentage, e.reduce)
      }
    })
    return resultLast
  }

  calculateSalary() {
    if (!this.grossSalary) return;
    let salary = parseFloat(this.grossSalary)
    this.inssEnd = this.calculateInss(salary)
    salary -= this.inssEnd
    this.irrfEnd = this.calculateIrrf(salary)
    salary -= this.irrfEnd
    this.planEnd = this.plan ? parseFloat(this.plan) : 0
    this.foodEnd = this.food ? parseFloat(this.food) : 0
    this.discountsEnd = this.otherDiscounts ? parseFloat(this.otherDiscounts) : 0
    salary -= this.planEnd
    salary -= this.foodEnd
    salary -= this.discountsEnd
    this.netSalary = parseFloat(salary.toFixed(2))
  }
}