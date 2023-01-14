// import Web3 from 'web3'
import ercabi from "./abi.json"
let abi = ercabi.abi
let address = ercabi.address
let web3 = new Web3(window.ethereum)
let ercMethods = {
  contractAddress(){
    return address 
  },
  address() {
    if (window.ethereum !== undefined && (window.ethereum.selectedAddress != undefined || window.ethereum.address != undefined)) {
      return window.ethereum.selectedAddress || window.ethereum.address
    } else {
      return false
    }
  },
  fromWei(amount){
    return web3.utils.fromWei(amount+'')
  },
  toAddress(address){
   return web3.utils.toChecksumAddress(address)
  },
  toWei(amount){
    return web3.utils.toWei(amount+'')
  },
  login(callBack) {//钱包登录授权
    if (this.address()) {//已经授权登录了，直接返回当前钱包网络信息、余额信息
      web3.eth.getBalance(this.address(), (err, balance) => {
        if (err) {
          callBack({
            code: 200,
            address: this.address(),
            networkId: window.ethereum.networkVersion,
            balance: 0 
          })
        } else {
          callBack({
            code: 200,
            address: this.address(),
            networkId: window.ethereum.networkVersion,
            balance: this.fromWei(balance) 
          })
        }
      })
    } else {//调用钱包登录流程
      try {
        window.ethereum.enable().then(res => {
          this.login(callBack)
        }).catch(function (reason) {
          callBack({
            code: 400,
            msg: '授权失败'
          })
        })
      } catch {
        callBack({
          code: 400,
          msg: '未检测到以太坊钱包'
        })
        return
      }
    }
    return

  },
  getCoinInfo(address,callBack){//根据代币Token查询代币信息
    // let web3 = this.getNetwork()
    // alert(web3.givenProvider.networkVersion)
    var code = web3.eth.getCode(address).then(
      res=>{
        console.log(res)
      }
    )
    if(code === '0x'){
      callBack({
        code:400,
        data:'No Contract'
      })
      return
    }else{
      // abi[window.ethereum.networkVersion]
      let contract = new web3.eth.Contract(abi.usdt,address) 
      // console.log(contract.methods)
      Promise.all([ contract.methods.symbol().call(),
         contract.methods.decimals().call(),
         contract.methods.totalSupply().call(),
         contract.methods.balanceOf(window.ethereum.selectedAddress).call(),
         contract.methods.name().call(),
        ])
      .then(values => {
        console.log(values)
        callBack({
          code:200,
          data:{
            address:address,
            name:values[0],
            decimals:values[1],
            totalSupply:values[2],
            balance:values[3],
            icon:'unknown'
          }
        })
      }).catch(e => {
        callBack({
          code:400,
          data:'No coin'
        })
      })
    }
  },
  getBalance(address,callBack,selectedAddress){//查询代币余额
     selectedAddress = selectedAddress||window.ethereum.selectedAddress
    if(address&&selectedAddress){
      // let web3 = this.getNetwork()
      let contract = new web3.eth.Contract(abi.usdt, address); 
      contract.methods.balanceOf(selectedAddress).call((err, balance) => {
        console.log(err, balance)
        if(err) {
          callBack({
            code:400,
            data:'0',
          })
        }else {
          callBack({
            code:200,
            data: balance
          })
        }
      })
    }else{
      callBack({
        code:200,
        data: '0'
      })
    }
    
  },
  pairLength(callBack){
    // let web3 = this.getNetwork()
    let factoryAbi = abi.factory
    let factoryAddress = address[window.ethereum.networkVersion].factory

    let contract = new web3.eth.Contract(factoryAbi,factoryAddress)
    contract.methods.allPairsLength().call((error, result) =>  {
      if(result){
        let arr = []
        for (let i = 0; i < Number(result); i++) {
          arr.push(this.allPairs(i))
        }
        Promise.all(arr).then(values => {
          console.log(values)
          callBack({
            code:200,
            data:values
          })
        })
      }else{
        callBack({
          code:400,
          data:error
        })
      }
    })
  },
  allPairs(index){
    return new Promise((resolve, reject)=>{
      let factoryAbi = abi.factory
      let factoryAddress = address[window.ethereum.networkVersion].factory
      let factoryContract = new web3.eth.Contract(factoryAbi,factoryAddress)
      factoryContract.methods.allPairs(index).call((error, result) =>  {
        if(result){
          let pairAbi = abi.pairUNI
          let pairAddress = result
          let pairContract = new web3.eth.Contract(pairAbi,pairAddress)

          pairContract.methods.balanceOf(window.ethereum.selectedAddress).call((error, result) =>  {
            if(result){
              if(result!=='0'){
                Promise.all([ 
                  pairContract.methods.token0().call(),
                  pairContract.methods.token1().call(), 
                  pairContract.methods.getReserves().call(),
                  pairContract.methods.totalSupply().call(),
                  pairContract.methods.decimals().call()
                ]).then(res=>{
                  let usdtAbi = abi.usdt
                  let usdtContract0 = new web3.eth.Contract(usdtAbi,res[0])
                  let usdtContract1 = new web3.eth.Contract(usdtAbi,res[1])
                  Promise.all([usdtContract0.methods.symbol().call(), usdtContract0.methods.decimals().call(),usdtContract1.methods.symbol().call(), usdtContract1.methods.decimals().call()]).then(values=>{
                    // console.log(values)
                    let liquidity = {
                      token0:res[0],
                      token1:res[1],
                      name0:values[0],
                      name1:values[2],
                      decimals0:values[1],
                      decimals1:values[3],
                      reserve0:res[2]._reserve0,
                      reserve1:res[2]._reserve1,
                      totalSupply:res[3],
                      decimals:res[4],
                      balance:result,
                      pairAddress:pairAddress
                    }
                    resolve(liquidity)
                  })
                })
              }else{
                resolve(false)
              }
            }else{
              resolve(false)
            }
          })
        }else{
          reject( error)
        }
      })
    })
  },
  getPair(address1,address2,callBack){//获取交易对信息
    // let web3 = this.getNetwork()
    let factoryAbi = abi.factory
    let factoryAddress = address[window.ethereum.networkVersion].factory
    let contract = new web3.eth.Contract(factoryAbi,factoryAddress)
    contract.methods.getPair(address1,address2).call(
    // contract.methods.getPair('0x0881Ff52A7CB082BEcbb2009954cB45Bebe3dF1d','0xF6b09B287B581476ed85C044626aA8fC12964aDC').call(
      (error, result) =>  {
      if(result){
        if(result==='0x0000000000000000000000000000000000000000'){
          callBack({
            code:400,
            data:result
          })
        }else{
          callBack({
            code:200,
            data:result
          })
        }
      }else{
        callBack({
          code:400,
          data:error
        })
        // console.log( error)
      }
    })
  },
  getReserves(pairAddress,callBack){//查询交易对详情
    // let web3 = this.getNetwork()
    let pairAbi = abi.pairUNI
    console.log(pairAddress)
    let contract = new web3.eth.Contract(pairAbi,pairAddress)
    contract.methods.getReserves().call((error, result) => {
      if(error){
        callBack({
          code:400,
          data:error
        })
      }else{
        callBack({
          code:200,
          data:result._blockTimestampLast
        })
      }
    })
  },
  pairInfo(pairAddress,callBack){//查询交易对详情
    // let web3 = this.getNetwork()
    let pairAbi = abi.pairUNI
    let contract = new web3.eth.Contract(pairAbi,pairAddress)
    Promise.all([ 
      contract.methods.token0().call(),
      contract.methods.token1().call(), 
      contract.methods.getReserves().call(),
      contract.methods.totalSupply().call(),
      contract.methods.decimals().call(),
      contract.methods.balanceOf(window.ethereum.selectedAddress).call()])
      .then(values => {
        callBack({
          code:200,
          data:{
            coinList:[
              { address:values[0], balance:values[2]._reserve0},
              { address:values[1],  balance:values[2]._reserve1}
            ],
            pairAddress:pairAddress,
            totalSupply:values[3],
            decimals:values[4],
            balance:values[5],
            blockTimestampLast:values[2]._blockTimestampLast
          }
        })
      }).catch(e => {
        callBack({
          code:400,
          data:e
        })
      })
  },
  addLiquidity(tokenA,tokenB,amountADesired,amountBDesired,amountAMin,amountBMin,deadline,callBack){//添加流动性
    let contractAbi = abi.router
    let contractAddress = address[window.ethereum.networkVersion].router
    let contract = new web3.eth.Contract(contractAbi, contractAddress);
    // console.log(tokenA,tokenB,amountADesired,amountBDesired,amountAMin,amountBMin,window.ethereum.selectedAddress,deadline)
    contract.methods.addLiquidity(tokenA,tokenB,amountADesired,amountBDesired,amountAMin,amountBMin,window.ethereum.selectedAddress,deadline+'').send({
      from: window.ethereum.selectedAddress,
    },(error, result) => {
      if(result){
        callBack({
          code:200,
          data:result
        })
      }else{
        callBack({
          code:400,
          data:error
        })
      }
    })
    
  },
  remove(tokenA,tokenB,liquidity,amountAMin,amountBMin,deadline,callBack){
    let contractAbi = abi.router
    let contractAddress = address[window.ethereum.networkVersion].router
    let contract = new web3.eth.Contract(contractAbi, contractAddress);
    contract.methods.removeLiquidity(tokenA,tokenB,liquidity,amountAMin,amountBMin,window.ethereum.selectedAddress,deadline).send({
      from: window.ethereum.selectedAddress,
    },(error, result) => {
      if(error){
        callBack({
          code:400,
          data:error
        })
      }else{
        callBack({
            code:200,
            data:result
        })
      }
    })
  },
  routerApprove(contractAddress,callBack){//授权
    let contractAbi = abi.usdt
    let approveAddress = address[window.ethereum.networkVersion].router
    let contract = new web3.eth.Contract(contractAbi, contractAddress);
    let num =  '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    contract.methods.approve(approveAddress,num ).send({
        from: window.ethereum.selectedAddress,
      },(error, result) => {
        if(error){//授权失败
          callBack({
            code:400,
            data:error
          })
        }else{//成功发起授权，需轮询授权结果
          callBack({
              code:200,
              data:result
          })
        }
    })
  },
  pairApprove(contractAddress,callBack){
    let contractAbi = abi.pairUNI
    let approveAddress = address[window.ethereum.networkVersion].router
    let contract = new web3.eth.Contract(contractAbi, contractAddress);
    let num =  '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    contract.methods.approve(approveAddress,num ).send({
        from: window.ethereum.selectedAddress,
    },(error, result) => {
        if(error){//授权失败
          callBack({
            code:400,
            data:error
          })
        }else{//成功发起授权，需轮询授权结果
          callBack({
              code:200,
              data:result
          })
        }
    })
  },
  swap(amountIn,amountOutMin,path,deadline,callBack){//兑换
    let contractAbi = abi.router
    let contractAddress = address[window.ethereum.networkVersion].router
    let contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log(amountIn,amountOutMin,path,window.ethereum.selectedAddress,deadline)
    contract.methods.swapExactTokensForTokens(amountIn,amountOutMin,path,window.ethereum.selectedAddress,deadline).send({
      from: window.ethereum.selectedAddress,
  },(error, result) => {
      if(error){//授权失败
        callBack({
          code:400,
          data:error
        })
      }else{//成功发起授权，需轮询授权结果
        callBack({
            code:200,
            data:result
        })
      }
  })
  },
  pairAllowance(contractAddress,callBack){//查询历史授权额度 type:币种,
    // let web3 = this.getNetwork()
    let contractAbi = abi.pairUNI
    let allowanceAddress = address[window.ethereum.networkVersion].router
    let contract = new web3.eth.Contract(contractAbi, contractAddress);
    contract.methods.allowance(window.ethereum.selectedAddress,allowanceAddress).call((error, result) => {
      if( !error ){
        callBack({
          code:200,
          data:result
        })
      }else{
        callBack({
          code:400,
          data:'查询授权记录失败'
        })
      }
    })
  },
  routerAllowance(contractAddress,callBack){//查询历史授权额度 type:币种,
    // let web3 = this.getNetwork()
    let contractAbi = abi.usdt
    let allowanceAddress = address[window.ethereum.networkVersion].router
    let contract = new web3.eth.Contract(contractAbi, contractAddress );
    contract.methods.allowance(window.ethereum.selectedAddress,allowanceAddress).call((error, result) => {
      if( !error ){
        callBack({
          code:200,
          data:result
        })
      }else{
        callBack({
          code:400,
          data:'查询授权记录失败'
        })
      }
    })
  },
  receipt(hash,callBack){//轮训hash
    // let web3 = this.getNetwork()
    web3.eth.getTransactionReceipt(hash ,(err,res)=>{
      if(err){
          callBack({
            code:400,
            data:'链信息查询失败'
          })
      }else{
        if(res){
          console.log(res)
          callBack({
            code:200,//已完成状态
            msg:res.status,//"0x1":成功，"0x0"失败
            data:res
          })
        }else{
          callBack({
            code:202,//padding状态，继续轮询
            data:'padding'
          })
        }
      }
    })
  },
  decodeLog(inputs,hexString,topics){
    return web3.eth.abi.decodeLog(inputs,
      hexString,topics
    )
  },
  getNetwork(){
    if(window.ethereum.networkVersion!='128'){
      let providersUrl = 'https://heco.zoswap.com/'
      return new Web3(new Web3.providers.HttpProvider(providersUrl))
    }else{
      return web3
    }
  },
}



export default ercMethods