<template>
<!-- :close-on-click-overlay = "false" -->
  <van-popup v-model="widgetVisible" position="center" get-container="body"  
    :overlay-style="{backgroundColor: 'rgba(0,0,0,.3)'}" 
    class='TransactionSettings'>
    <div class="">
      <h3>{{ $t('settings[0]') }}</h3>
      <p>{{ $t('settings[1]') }}</p>
      <ul>
        <li class="btn" :class="slippage===0.1&&'active'" @click="setSlippage(0.1)">0.1%</li>
        <li class="btn" :class="slippage===0.5&&'active'" @click="setSlippage(0.5)">0.5%</li>
        <li class="btn" :class="slippage===1&&'active'" @click="setSlippage(1)">1%</li>
        <li  :class="slippage!==0.1&&slippage!==0.5&&slippage!==1&&'active'"> <input placeholder="0.1" type="text" v-model="value1" @input="value1Input"> %</li>
      </ul>
      <p>{{ $t('settings[2]') }}</p>
      <div class="deadline"><input type="text"  v-model="value2" placeholder="1" @input="value2Input">{{ $t('settings[3]') }}</div>
      <div class="lan-box">
        <p>{{ $t('settings[4]') }}:</p>
        <p :class="{active: $i18n.locale === 'en'}" @click="switchLan('en')">English</p>
        <p>/</p>
        <p :class="{active: $i18n.locale === 'cn'}" @click="switchLan('cn')">繁體中文</p>
        <p>/</p>
        <p :class="{active: $i18n.locale === 'pt'}" @click="switchLan('pt')">português</p>
        <p>/</p>
        <p :class="{active: $i18n.locale === 'rn'}" @click="switchLan('rn')">русский</p>
      </div>
    </div>
  </van-popup>
</template>
<script>
import { mapMutations,mapState } from "vuex";


export default {
  props:{
    
  },
  computed: { ...mapState(['slippage','deadline']) },
  data() {
    return {
      widgetVisible:false,
      value1:'',
      value2:''
    }
  },
  mounted() {
  },
  methods:{
    ...mapMutations([ "setSlippage","setDeadline"]),
    switchLan (lan) {
      if (lan === this.$i18n.locale) {
        return false
      }
      localStorage.setItem('zooswap-lang', lan)
      this.$i18n.locale = lan
      location.reload()
    },
    show(){ 
      this.value1 = this.slippage
      this.value2 = this.deadline
      this.widgetVisible = true 
    },
    value1Input(){ 
      this.value1 = this.value1 + ""
      if(this.value1[0]=='.'){
        this.value1 = '0'+this.value1
      }
      this.value1 = this.value1.replace(/^\.$/g,"");  //清除第一个“.”   
      this.value1 = this.value1.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
      this.value1 = this.value1.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
      this.value1 = this.value1.replace(".","$#$").replace(/\./g,"").replace("$#$",".");   
      this.value1 = this.value1.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3');//只能输入1个小数 
      if(this.value1.indexOf(".")< 0 && this.value1 !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        this.value1= parseFloat(this.value1);
      }
      if(parseFloat(this.value1)>=0.1){
        this.setSlippage(parseFloat(this.value1))
      }else{
        this.setSlippage(parseFloat(0.1))
      }
    },
    value2Input(){ 
      this.value2 = this.value2 + ""
     this.value2 = this.value2.replace(/[^\d]/g,"");  //清除“数字”以外的字符    
      if(this.value2.indexOf(".")< 0 && this.value2 !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        this.value2= parseFloat(this.value2);
      }
      if(parseFloat(this.value2)>=1){
        this.setDeadline(parseFloat(this.value2))
      }else{
        this.setDeadline(parseFloat(1))
      }
    },
  },
  components: {
  }
}
</script>
<style lang='less' scoped>
.TransactionSettings{
  background: transparent;
  top:250px;
  transform:none;
  top: 60px;
  right: 30px;
  left: auto;
  width: 344px;
  &>div{
    width: 344px;
    background: #565A66;
    border-radius: 12px;
    top: 120px;
    box-sizing: border-box;
    padding: 16px;
    h3{
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    p{
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, .8);
      line-height: 18px;
      margin-bottom: 12px;
    }
    .deadline{
      color: #FFFFFF;
      input{
        padding:  0 13px;
        background: #868994;
        border-radius: 20px;
        border: 1px solid #A2A5B2;
        width: 50px;
        height: 40px;
        margin-right: 10px;
        font-size: 16px;
        outline: none;
        text-align: right;
        color: #fff;
        text-align: center;
        &::placeholder{
          color: rgba(0, 0, 0, .3);
        }
      }
    }
    .lan-box {
      display: none;
      width: 100%;
      padding: 10px 0;
      box-sizing: border-box;
      margin-top: 20px;
      align-items: center;
      flex-wrap: wrap;
      p {
        margin: 0;
      }
      & > p:first-child {
        margin-bottom: 20px;
        width: 100%;
      }
      & > p:nth-child(3), p:nth-child(5), p:nth-child(7) {
        margin: 0 10px;
      }
      & > p:nth-child(2), p:nth-child(4), p:nth-child(6), p:nth-child(8) {
        cursor: pointer;
      }
      .active {
        color: #2B7EFF;
      }
    }
    ul{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 16px;
      li{
        font-size: 18px;
        height: 40px;
        font-weight: 500;
        color: #FFFFFF;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding:  0 13px;
        background: #868994;
        border-radius: 20px;
        border: 1px solid #A2A5B2;
        &.btn{
          cursor: pointer;
        }
        &.active{
          background: #2B7EFF;
          border: 1px solid rgba(43, 126, 255, 0.3);
        }
        &:last-of-type{
          input{
            width: 50px;
            background:transparent;
            border: none;
            outline: none;
            text-align: center;
            &::placeholder{
              color: rgba(0, 0, 0, .3);
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 600px){
    top: 50px;
    right: 16px;
    & > div {
      .lan-box {
        display: flex;
      }
    }
  }
}
</style>
