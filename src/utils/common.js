import { BigNumber } from 'bignumber.js'
let common = {
  balance(obj){
    if(obj&&obj.balance){
      if(obj.balance==='0'||obj.balance==='--'){
        return 0
      }else{
        return this.fromWei(obj.balance,obj.decimals)
      }
    }else{
      return '--'
    }
    
  },
  
  toWei(num,decimals){
    // console.log(num)
    if(decimals=== '0') {return num.toString().split('.')[0]}
    num = new BigNumber(num||0)
    decimals = new BigNumber(decimals||18)
    return  num.multipliedBy(10**decimals).toFixed(1).split('.')[0]
  },
  fromWei(num,decimals){
    if(!num){
      return '--'
    }else if(!decimals){
      return 'num'
    }
    if(decimals === '0') {
      return num.toString().split('.')[0]
    }
    num = num||0
    decimals = decimals||18
    let amount = num
    return this.decimalsFilter(amount,decimals)
  },
  decimalsFilter(num,decimals){
    if(!num){
      return '--'
    }else if(!decimals){
      return 'num'
    }
    let amount = num.toString().split('.')[0]
    // console.log(amount)
    decimals = Number(decimals)
    if(amount.length<decimals+1){
      let length =decimals+1-amount.length
      for (let i = 0; i < length; i++) {
        amount = '0'+amount
      }
    }
    amount = (amount.slice(0,amount.length-decimals)+'.'+amount.slice(amount.length-decimals)).replace(/0+$/g,"")
    if(amount[amount.length-1] === '.'){
      return  amount.split('.')[0]
    }else{
      return  amount
    }
  },
  miniMum(decimals){
    let length = 0
    let amount = '1'
    if(decimals>8){
      length = decimals-8
    }else{
      length = decimals
    }
    for (let i = 0; i < length; i++) {
      amount = amount + '0'
    }
    return amount
  },
  getToAmount(amount,balanceA,balanceB){
    let a = new BigNumber(balanceA)
    let b = new BigNumber(balanceB)
    let x = new BigNumber(amount).multipliedBy(0.997).toFixed(1).split('.')[0]
    // console.log(a.toFixed(1).split('.')[0])
    // console.log(b.toFixed(1).split('.')[0])
    // console.log(x)

    // console.log(b.multipliedBy(x).div(a.plus(x)).toFixed(1).split('.')[0])
    let newAmount = b.multipliedBy(x).div(a.plus(x)).toFixed(1).split('.')[0]
    // console.log(newAmount)
    return newAmount
  },
  getToAmount2(amount,balanceA,balanceB){//给手续费为最小精度单位的币种计算
    let a = new BigNumber(balanceA)
    let b = new BigNumber(balanceB)
    let x = new BigNumber(amount)
    let newAmount = b.multipliedBy(x).div(a.plus(x)).toFixed(1).split('.')[0]
    return newAmount
  },
  getFromAmount(amount,balanceA,balanceB){
    // console.log(111)
    let b =new BigNumber(balanceB)
    let a=new BigNumber(balanceA)
    let x = new BigNumber(amount)
    if(x.gte(b)) return ""
    return  a.multipliedBy(x).div(b.minus(x)).div(0.997).toFixed(1).split('.')[0]
  },
  
  // console.log(this.ercMethods.toWei('12'))
  //   fromWei
}



export default common