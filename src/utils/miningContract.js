// import Web3 from 'web3'
import ercabi from "./abi.json"
let abi = ercabi.abi
let address = ercabi.address
let web3 = new Web3(window.ethereum)
let miningContract = {
  toAddress(address){
    return web3.utils.toChecksumAddress(address)
  },
  stakeParams(miningAddress,callBack){
    let contract = new web3.eth.Contract(abi.mining, miningAddress)
    // console.log(contract.methods)
    contract.methods.stakeParams(window.ethereum.selectedAddress).call((error, result) => {
      if( !error ){
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
  allowance(contractAddress,bankAddress,callBack){//查询历史授权额度 type:币种,
    let contract = new web3.eth.Contract(abi.usdt, contractAddress);
    contract.methods.allowance(window.ethereum.selectedAddress,bankAddress).call((error, result) => {
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
  approve(contractAddress,approveAddress,callBack){
    let contractAbi = abi.usdt
    let contract = new web3.eth.Contract(abi.usdt, contractAddress);
    let num =  '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    // console.log(approveAddress)
    contract.methods.approve(approveAddress==='isInvite'?address[window.ethereum.networkVersion].relation:approveAddress,num ).send({
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
  stake(amount,bankAddress,callBack){
    console.log(amount,bankAddress)
    let contract = new web3.eth.Contract(abi.mining, bankAddress);
    console.log(contract.methods)
    contract.methods.stake(amount).send({
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
  withdraw(bankAddress,callBack){
    let bankContract = new web3.eth.Contract(abi.mining,bankAddress)
    console.log(bankContract.methods)
    bankContract.methods.withdraw().send({
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
  withdrawRewards(bankAddress,callBack){
    let bankContract = new web3.eth.Contract(abi.mining,bankAddress)
    bankContract.methods.withdrawRewards().send({
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
  // TODO 此方法的作用被下面的invite_new 方法替代
  invite(inviteAddress,callBack){
    let relationAbi = abi.relation
    let relationAddress = address[window.ethereum.networkVersion].relation
    let relationContract = new web3.eth.Contract(relationAbi,relationAddress)
    relationContract.methods.join(inviteAddress).send({
      from: window.ethereum.selectedAddress,
    },(error, result) => {
      console.log(error, result)
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
  invite_new (inviteAddress, callBack) {
    const rlinkAbi = abi.new_relation
    const relationAddress = address[window.ethereum.networkVersion].new_relation
    const rlinkContract = new web3.eth.Contract(rlinkAbi, relationAddress)
    rlinkContract.methods.addRelation(window.ethereum.selectedAddress, inviteAddress)
      .send(
        { from: window.ethereum.selectedAddress },
        (err, hash) => {
          if(hash){
            callBack({
              code: 200,
              data: hash
            })
          }else{
            callBack({
              code: 400,
              data: err
            })
          }
        }
      )
  },
  parentOf (userAddress) {
    const rlinkAbi = abi.new_relation
    const relationAddress = address[window.ethereum.networkVersion].new_relation
    const rlinkContract = new web3.eth.Contract(rlinkAbi, relationAddress)
    return new Promise((resolve, reject) => {
      rlinkContract.methods.parentOf(userAddress || window.ethereum.selectedAddress)
        .call((e, hash) => {
          // console.log(hash)
          if (e) {
            reject(e)
          }
          if (hash === '0x0000000000000000000000000000000000000000') {
            reject(e)
          }
          resolve(hash)
        })
    })
  },
  // TODO 邀请相关合约地址和方法改了之后，此方法的作用被上面的parentOf方法替代了。
  nodeParent(inviteAddress,callBack){
    let relationAbi = abi.relation
    let relationAddress = address[window.ethereum.networkVersion].relation
    let relationContract = new web3.eth.Contract(relationAbi,relationAddress)
    relationContract.methods.nodeParent(inviteAddress).call((error, result) => {
      // console.log(error, result)
      if(result&&result!=='0x0000000000000000000000000000000000000000'){
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



  manager(bankAddress,callBack){
    let bankAbi = abi.mining
    let contract = new web3.eth.Contract(bankAbi, bankAddress);
    contract.methods.manager().call((error, result) => {
      if(result&& this.toAddress(result) === this.toAddress(window.ethereum.selectedAddress)){
        callBack({
          code:200,
          data:true
        })
      }else{
        callBack({
          code:400,
          data:error||result
        })
      }
    })
  },
  allRewardRates(bankAddress,callBack){
    let contract = new web3.eth.Contract(abi.mining, bankAddress);
    contract.methods.allRewardRates().call((error, result) => {
      if( !error ){
        callBack({
          code:200,
          data:result
        })
      }else{
        callBack({
          code:400,
          data:'查询收益记录失败'
        })
      }
    })
  },
  setRewardsRate(amount,bankAddress,callBack){
    let contract = new web3.eth.Contract(abi.mining, bankAddress);
    contract.methods.setRewardsRate(amount).send({
      from: window.ethereum.selectedAddress,
    },(error, result) => {
      if( !error ){
        callBack({
          code:200,
          data:result
        })
      }else{
        callBack({
          code:400,
          data:'查询收益记录失败'
        })
      }
    })
  },
  
}



export default miningContract