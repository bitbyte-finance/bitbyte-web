<template>
  <van-popup v-model="widgetVisible" position="center" get-container="body"  
    :overlay-style="{}" 
    class='removeLiquidityConfirm'>
    <div class="" v-if="state == 1 &&pairInfo&&pairInfo.totalSupply">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <h3>{{ $t('pool.content.add.confirm.s1[0]') }}</h3>
      <div class="receive">
        <p>{{ common.fromWei(amount1,coin1.decimals) | hideDecimal  }}</p>
        <p><img v-if="coin1.name" :src="setUrl(coin1.name)" alt="">{{coin1.name}}</p>
      </div>
      <div class="receive">
        <p>{{common.fromWei(amount2,coin2.decimals) | hideDecimal}}</p>
        <p><img v-if="coin2.name" :src="setUrl(coin2.name)" alt="">{{coin2.name}}</p>
      </div>
      <p>{{ $t('pool.content.remove.confirm[0]') }} {{ common.fromWei(amountAMin,coin1.decimals)| hideDecimal }} {{coin1.name}} {{ $t('pool.content.remove.confirm[1]') }} {{ common.fromWei(amountBMin,coin2.decimals)| hideDecimal }} {{coin2.name}}  {{ $t('pool.content.remove.confirm[2]') }}</p>
      <div class="info">
        <div>
          <p> 
            <img :src="setUrl(coin1.name)" alt="">
            <img :src="setUrl(coin2.name)" alt=""> 
            {{ coin1.name+'/'+coin2.name }}</p>
          <p>
            <span>{{common.fromWei( BigNumber(pairInfo.balance).multipliedBy(amount).div(100).toFixed(1).split('.')[0] ,pairInfo.decimals) | hideDecimal}}</span>
          </p>
        </div>
        <div class="rate" v-if="info.balance2">
          <p>{{ $t('pool.content.remove.confirm[3]') }}</p>
          <p> <span>1 {{coin1.name}} = {{ BigNumber(common.fromWei(info.balance2,coin2.decimals)).div(common.fromWei(info.balance1,coin1.decimals)).toFixed(18) | hideDecimal }} {{coin2.name}}</span>  </p>
        </div>
        <div v-if="info.balance2">
          <p></p>
          <p><span>1 {{coin2.name}} = {{ BigNumber(common.fromWei(info.balance1,coin1.decimals)).div(common.fromWei(info.balance2,coin2.decimals)).toFixed(18) | hideDecimal }} {{coin1.name}}</span>  </p>
        </div>
        

      </div>
      <div class="btn" @click="remove">{{ $t('pool.content.remove.confirm[4]') }}</div>
    </div>
    <div  v-if="state == 2">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="load">
        <div class="loading"></div>
        <h3>{{ $t('pool.content.add.confirm.s2[0]') }}</h3>
        <p>{{text}}</p>
        <span>{{ $t('pool.content.add.confirm.s2[1]') }}</span>
      </div>
    </div>
    <div  v-if="state == 3">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../assets/img/complete.svg" alt="">
        <h3>{{ $t('pool.content.add.confirm.s3[0]') }}</h3>
        <p>{{text}}</p>
        <div class="btn" @click="widgetVisible=false">{{ $t('pool.content.add.confirm.s3[1]') }}</div>
      </div>
    </div>
    <div  v-if="state == 4">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../assets/img/fail.svg" alt="">
        <h3>{{ $t('pool.content.add.confirm.s4[0]') }}</h3>
        <div class="btn" @click="widgetVisible=false">{{ $t('pool.content.add.confirm.s4[1]') }}</div>
      </div>
    </div>
  </van-popup>
</template>
<script>

import { mapMutations,mapState } from "vuex";
export default {
  
  
  props:{
    pairInfo:'',
    coin1:'',
    coin2:'',
    amount:'',
    amount1:'',
    amount2:'',
    info:'',
    
  },
  data() {
    return {
      widgetVisible:false,
      state:1,//1:创建订单前 2:加载中 3:创建成功 4:创建失败
      text:'',
    }
  },
  computed: { 
    ...mapState(['records','slippage','deadline']),
    amountAMin(){
      let amount = this.BigNumber(this.common.fromWei(this.amount1,this.coin1.decimals)).multipliedBy( 1-(this.slippage/100) ).toString()
      // console.log(this.common.toWei(amount,this.coin1.decimals))
      return this.common.toWei(amount,this.coin1.decimals)
    },
    amountBMin(){
      let amount = this.BigNumber(this.common.fromWei(this.amount2,this.coin2.decimals)).multipliedBy( 1-(this.slippage/100) ).toString()
      // console.log(this.common.toWei(amount,this.coin1.decimals))
      return this.common.toWei(amount,this.coin2.decimals)
    }
  },
  mounted() {
  },
  methods:{
    ...mapMutations(["setRecords"]),
    show(){ 
      this.state = 1
      // console.log(this.pairInfo)
      this.widgetVisible = true 
    },
    remove(){
      this.state = 2
      let deadline = (Math.floor(new Date().getTime()/1000) + this.deadline*60).toString()
      let liquidity = this.BigNumber(this.common.fromWei(this.pairInfo.balance,this.pairInfo.decimals)).multipliedBy(this.amount).div(100) .toString()
      liquidity = this.common.toWei(liquidity,this.pairInfo.decimals)
      this.text = `Removing ${ this.$hideDecimal(this.common.fromWei(this.amount1,this.coin1.decimals))  } ${this.coin1.name} and ${ this.$hideDecimal(this.common.fromWei(this.amount2,this.coin2.decimals))  } ${this.coin2.name}`
      // let miniMum = this.common.fromWei(1,this.pairInfo.decimals) 
      // if(this.pairInfo.balance-liquidity<miniMum*1){
      //   liquidity = this.pairInfo.balance
      // }
      // console.log(this.pairInfo.balance)
      // console.log(liquidity.toString(),this.amountAMin,this.amountBMin)
      // return
      this.ercMethods.remove(this.coin1.address,this.coin2.address,liquidity.toString(),this.amountAMin,this.amountBMin,deadline,res=>{
        if(res.code==200){
          let obj = {
            hash:res.data,
            type:'remove',
            state:1,
            pairAddress:this.pairInfo.pairAddress,
            msg:this.text
          }
          this.$parent.refresh()
          this.setRecords(obj)
          this.state =3
        }else{
          console.log(res)
          this.state =4
        }
      })
    },
    setUrl(name){
      try {
        return require(`../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../assets/img/coin/unknown.svg')
      }
    },
  },
  components: {
  }
}
</script>
<style lang='less' scoped>
.removeLiquidityConfirm{
  background: rgba(0,0,0,0);
  top:250px;
  transform:translate3d(-50%,0,0);
  &>div{
    width: 344px;
    background: #565A66;
    border-radius: 12px;
    top: 120px;
    box-sizing: border-box;
    padding: 30px 20px;
    &>.close{
      position: absolute;
      right: 0;
      top: 0;
      padding: 10px;
      line-height: 0;
      font-size: 0;
      cursor: pointer;
      img{
        width: 30px;
        height: 30px;
      }
    }
    &>h3{
      font-size: 18px;
      line-height: 20px;
      font-weight: normal;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    &>p{
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, .6);
      line-height: 18px;
      margin-bottom: 25px;
    }
    .receive{
      
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      overflow: hidden;
      p{
        font-size: 26px;
        color: #fff;
        margin: 0;
        font-weight: 600;
        // margin-right: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        &:first-of-type{
          flex: 1;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      img{
        width: 36px;
        height: 36px;
        position: relative;
        z-index: 1;
        &:last-of-type{
          // left: -10px;
          z-index: 0;
        }
      }
    }
    .info{
      div{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        margin-bottom: 10px;
        overflow: hidden;
        &.rate{
          margin-bottom: 5px;
        }
        &:last-of-type{
          margin-bottom: 0;
        }
        p{
          color: #fff;
          font-size: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          img{
            width: 30px;
            margin-right: 5px;
            position: relative;
            z-index: 1;
            &:last-of-type{
              z-index: 0;
              left: -10px;
            }
          }
          
          &:last-of-type{
            z-index: 0;
            padding-left: 10px;
            flex: 1;
            overflow: hidden;
            padding-left: 12px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            box-sizing: border-box;
            span{
              text-align: right;
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .btn{
      height: 60px;
      line-height: 60px;
      border-radius: 30px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      background: #2B7EFF;
      color: #FFFFFF;
      margin-top: 25px;
    }
    .load{
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      padding-top: 40px;
      .loading{
        width: 50px;
        height: 50px;
        margin-bottom: 20px;
      }
      h3{
        color: #fff;
        font-weight: normal;
        margin-bottom: 16px;
      }
      p{
        font-size: 16px;
        color: #fff;
        margin-bottom: 16px;
        white-space:normal; word-break:break-all;
      }
      span{
        font-size: 12px;
        color: #fff;
      }
    }
    .complete{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-top: 40px;
      img{
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
      }
      h3{
        color: #fff;
        font-weight: normal;
        margin-bottom: 16px;
      }
      p{
        color: #2B7EFF;
        font-size: 14px;
      }
      &>div{
        width: 100%;
      }
    }
  }
  @media screen and (max-width: 600px){
    top: 100px;
    width: 100%;
    &>div{
      width: 90%;
      margin: 0 auto;
      &>.close{
        right: 5%;
      }
    }
  }
}
</style>
