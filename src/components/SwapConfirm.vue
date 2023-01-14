<template>
  <van-popup v-model="widgetVisible" position="center" get-container="body"  
    :overlay-style="{}" 
    class='swapConfirm'>
    <div class="" v-if="state == 1 &&pairInfo&&pairInfo.totalSupply">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <h3>{{ $t('swap.confirm[0]') }}</h3>
      <div class="swap">
        <p><img :src="setUrl(coin1.name)" alt=""> <span>{{amount1 | hideDecimal}}</span> </p> 
        <img src="../assets/img/arrowDown.svg" alt="">
        <p><img :src="setUrl(coin2.name)" alt=""> <span>{{amount2 | hideDecimal}}</span> </p> 
      </div>
      <div class="updated" v-if="blockTimestampLast !== pairInfo.blockTimestampLast">
        <p> <img src="../assets/img/Wrong.svg" alt=""> Price Updated</p>
        <div @click="Updated">Accept<span v-if="loadingPair" class="loading" ></span></div>
      </div>
      <p>{{ $t('swap.confirm[1]') }} {{ amountOutMin | hideDecimal }} {{ coin2.name }} {{ $t('swap.confirm[2]') }}</p>
      <div class="info">
        <div class="rate">
          <p>{{ $t('swap.confirm[3]') }}</p>
          <p> 1 {{coin1.name}} = {{ price1 | hideDecimal }} {{coin2.name}} </p>
        </div>
        <div>
          <p></p>
          <p> 1 {{coin2.name}} = {{ price2 | hideDecimal }} {{coin1.name}} </p>
        </div>
        <div>
          <p>{{ $t('swap.confirm[4]') }}</p>
          <p> {{ amountOutMin | hideDecimal }} {{ coin2.name }}</p>
        </div>
        <div>
          <p>{{ $t('swap.confirm[5]') }}</p>
          <p> {{fee | hideDecimal}} {{ coin1.name }}</p>
        </div>
        

      </div>
      <div class="btn" @click="swap">{{ $t('swap.confirm[0]') }}</div>
    </div>
    <div  v-if="state == 2">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="load">
        <div class="loading"></div>
        <h3>{{ $t('mining.withdraw.s2[0]') }}</h3>
        <p>{{text}}</p>
        <span>{{ $t('mining.withdraw.s2[1]') }}</span>
      </div>
    </div>
    <div  v-if="state == 3">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../assets/img/complete.svg" alt="">
        <h3>{{ $t('mining.withdraw.s3[0]') }}</h3>
        <p>{{text}}</p>
        <div class="btn" @click="widgetVisible=false">{{ $t('mining.withdraw.s3[1]') }}</div>
      </div>
    </div>
    <div  v-if="state == 4">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../assets/img/fail.svg" alt="">
        <h3>{{ $t('mining.withdraw.s4[0]') }}</h3>
        <div class="btn" @click="widgetVisible=false">{{ $t('mining.withdraw.s4[0]') }}</div>
      </div>
    </div>
  </van-popup>
</template>
<script>

import { mapMutations,mapState } from "vuex";
export default {
  
  computed: { ...mapState(['records','slippage','deadline']) },
  props:{
    pairInfo:'',
    coin1:'',
    coin2:'',
    amount1:'',
    amount2:'',
    fee:'',
    price1:'',
    price2:'',
    amountOutMin:'',
    loadingPair:'',
  },
  data() {
    return {
      widgetVisible:false,
      state:1,//1:创建订单前 2:加载中 3:创建成功 4:创建失败
      text:'',
      timer:null,
      blockTimestampLast:''
    }
  },
  mounted() {
  },
  methods:{
    ...mapMutations(["setRecords"]),
    show(){ 
      this.state =1
      this.widgetVisible = true 
      this.blockTimestampLast = this.pairInfo.blockTimestampLast
    },
    setUrl(name){
      try {
        return require(`../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../assets/img/coin/unknown.svg')
      }
    },
    Updated(){
      // console.log(this.$parent)
      this.$parent.getPair()
    },
    swap(){
      this.state =2
      let deadline = Math.floor(new Date().getTime()/1000) + this.deadline*60
      let amountIn =  this.common.toWei(this.amount1,this.coin1.decimals) 
      let amountOutMin = this.common.toWei(this.amountOutMin,this.coin2.decimals) 
      this.text = `${this.$t('confirmMessage[0]')} ${ this.$hideDecimal(this.amount1)} ${this.coin1.name} ${this.$t('confirmMessage[1]')} ${this.$hideDecimal(this.amount2)} ${this.coin2.name}`
      clearTimeout(this.timer)
      this.ercMethods.swap(amountIn,amountOutMin,[this.coin1.address,this.coin2.address],deadline,res=>{
        if(res.code==200){
          let obj = {
            hash:res.data,
            type:'swap',
            state:1,
            pairAddress:this.pairInfo.pairAddress,
            msg:this.text
          }
          
          this.setRecords(obj)
          this.$parent.refresh()
          this.state =3
        }else{
          // console.log(res)
          this.state =4
        }
      })
    },
    getReserves(){
      this.ercMethods.getReserves(this.pairInfo.pairAddress,res=>{
        console.log(res.data,this.pairInfo.blockTimestampLast)
        if(res.data){
          this.blockTimestampLast = res.data
        }
        this.timer = setTimeout(()=>{
          this.getReserves()
        },3000)
        
      })
    }
  },
  watch:{
    widgetVisible(newval,oldval){
      if(!newval){
        clearTimeout(this.timer)
      }else{
        this.getReserves()
      }
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  components: {
  }
}
</script>
<style lang='less' scoped>
.swapConfirm{
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
    &>.updated{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  10px ;
      margin-bottom: 6px;
      border-radius: 10px;
      background: rgba(107, 110, 119, 0.8);
      p{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        img{
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
      }
      &>div{
        font-size: 14px;
        width: 90px;
        padding: 6px 0;
        background: #2B7EFF;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        span{
          margin-left: 6px;
        }
      }
    }
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
    .swap{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 16px;
      overflow: hidden;
      &>img{
        width: 26px;
        height: 26px;
        margin: 5px;
      }
      p{
        width: 100%;
        font-size: 26px;
        color: #fff;
        margin: 0;
        font-weight: 600;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        span{
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        img{
          width: 36px;
          height: 36px;
          margin-right: 6px;
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
        &.rate{
          margin-bottom: 5px;
        }
        &:last-of-type{
          margin-bottom: 0;
        }
        p{
          color: #fff;
          font-size: 16px;
          img{
            width: 20px;
            margin-right: 5px;
          }
          &:last-of-type{
            text-align: right;
            flex: 1;
            padding-left: 10px;
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            
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
