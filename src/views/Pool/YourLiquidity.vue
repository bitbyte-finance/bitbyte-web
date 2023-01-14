<template>
  <div class='YourLiquidity'>
    <div class="noData" v-if="!userInfo.isNetwork">
      <div>
        <p> 
          <span v-if="!userInfo.address" @click="connectWallet">{{ $t('pool.content.your.noData[0]') }}</span>
          <span v-else @click="connectNetwork">{{ $t('pool.content.your.noData[1]') }}</span>
          {{ $t('pool.content.your.noData[2]') }}</p>
      </div>
    </div>
    <div class="loading" v-else-if="isLoading"></div>
    <div class="noData" v-else-if=" list.length === 0 ">
      <div><p>{{ $t('pool.content.your.noData[3]') }}</p></div>
    </div>
    <div class="poolList" v-else>
      <van-collapse  v-model="activeNames" :accordion="false">
        <van-collapse-item :name="index" v-for=" (item,index) in list " :key="index">
          <template #title>
            
            <div class="collapseTitle"> 
              <div>
                <img :src="setUrl(item.name0)"  alt="">
                <img :src="setUrl(item.name1)" alt="">
              </div>
              <p>{{item.name0}}/{{item.name1}}</p> 
            </div>
          </template>
          <div class="collapseContent">
            <div class="data">
              <div>
                <span>{{ $t('pool.content.your.colContent.form[0]') }}</span>
                <p> <span>{{ common.fromWei(item.balance,item.decimals) | hideDecimal }}</span> </p>
              </div>
              <div>
                <span>{{ $t('pool.content.your.colContent.form[1]') }} {{item.name0}}:</span>
                <p> <span>{{ Pooled0(item) | hideDecimal }}</span> </p>
              </div>
            </div>
            <div class="data">
              <div>
                <span>{{ $t('pool.content.your.colContent.form[1]') }} {{item.name1}}:</span>
                <p> <span>{{ Pooled1(item) | hideDecimal}}</span> </p>
              </div>
              <div>
                <span>{{ $t('pool.content.your.colContent.form[2]') }}</span>
                <p> <span>{{YourPoolShare(item)| hideDecimal}}</span> %</p>
              </div>
            </div>
            <div class="data">
              <div>
                <span>{{ $t('pool.content.your.colContent.form[3]') }}:</span>
                <p style="text-decoration-line: underline; cursor: pointer;" v-clipboard:copy="item.pairAddress" v-clipboard:success="copySuccess" v-clipboard:error="copyError"> <span>{{ item.pairAddress }}</span> </p>
              </div>
            </div>
            <div class="btns">
              <div @click="goPage('RemoveLiquidity',item)">{{ $t('pool.content.your.colContent.btn[0]') }}</div>
              <div class="add" @click="goPage('AddLiquidity',item)">{{ $t('pool.content.your.colContent.btn[1]') }}</div>
            </div>
          </div>
        </van-collapse-item>
       
      </van-collapse>
    </div>
  </div>
</template>
<script>
  import { mapMutations,mapState } from "vuex";
  export default {
    components: {
    },
    computed: { ...mapState(['userInfo','records']) },
    data() { 
        return {
          // img:require(`../../assets/img/coin/BTC.svg`),
          default:require('../../assets/img/coin/unknown.svg'),
          activeNames: [],
          list:[],
          isLoading:false,
        }
    },
    mounted() {
      this.pairLength()
    },
    methods: {
      copySuccess(e) {  this.$toast(this.$t('toast[0]')) },
      copyError(e) {  this.$toast(this.$t('toast[1]')) },
      connectWallet(){
        this.$parent.$parent.$refs.header.$refs.User.ConnectWalletVisible = true
      },
      connectNetwork(){
        this.$parent.$parent.$refs.header.$refs.User.switchNetwork('heco')
      },
      pairLength(){
        // console.log(this.isLoading)
        if(!this.userInfo.address){return}
        this.isLoading = true
        this.ercMethods.pairLength(res=>{
          if(res.code === 200){
            this.list = res.data.filter(item=>{ return item })
          }
          this.isLoading = false
        })
      },
      Pooled0(item){
        let num = this.BigNumber(item.balance).div(item.totalSupply).multipliedBy(item.reserve0).toFixed(1).split('.')[0]
        return this.common.fromWei(num,item.decimals0)
      },
      Pooled1(item){
        let num = this.BigNumber(item.balance).div(item.totalSupply).multipliedBy(item.reserve1).toFixed(8).split('.')[0]
        return this.common.fromWei(num,item.decimals1)
      },
      YourPoolShare(item){
        let num = this.BigNumber(item.balance).div(item.totalSupply).multipliedBy(100).toFixed(18)
          return num
      },
      setUrl(name){
        try {
          return require(`../../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
        } catch (e) {
          return require('../../assets/img/coin/unknown.svg')
        }
      },
      goPage(name,item){
        let params
        if(name==='AddLiquidity'){
          params = { address1: item.token0,address2: item.token1 }
        }else{
          params = { 
            coin1:{name:item.name0,address:item.token0,decimals:item.decimals0},
            coin2:{name:item.name1,address:item.token1,decimals:item.decimals1},

          }
        }
        this.$router.push({
          name:name,
          params: params
        })
      }
    },
    watch:{
      "userInfo.networkId": {
        deep: true,
        handler: function (newValue, oldValue) {
          this.list = []
          this.pairLength()
        }
      },
      "userInfo.address": {
        deep: true,
        handler: function (newValue, oldValue) {
          this.list = []
          this.pairLength()
        }
      }
    }  
  }
</script>
<style lang='less' scoped>
.YourLiquidity{
  min-height: 400px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding:  0 ;
  .loading{
    margin: 100px auto;
    width: 100px;
    height: 100px;
  }
  .noData{
    padding-top: 154px;
    &>div{
     p{
       text-align: center;
       font-size: 18px;
      // font-weight: 500;
      color:rgba(255, 255, 255, .6);
      line-height: 22px;
      margin-bottom: 24px;
      &:last-of-type{
        margin-bottom: 0;
      }
      span{
        color: #303DE8;
        text-decoration: underline;
        cursor: pointer;
      }
     }
      
    }
  }
  .poolList{
    padding-top: 24px;
    /deep/.van-collapse{
      // background: red;
      &::after{
        display: none;
      }
      .van-collapse-item{
        margin-bottom: 16px;
        border-radius: 16px;
        overflow: hidden;
        &::after{
          display: none;
        }
        &>.van-collapse-item__title{
          background: rgba(107, 110, 119, .8);
          padding: 24px;
          line-height: 0;
          &::after{
            display: none;
          }
          .van-cell__title{
            .collapseTitle{
              display: flex;
              flex-direction: row;
              align-items: center;
              box-sizing: border-box;
              padding:  0 ;
              &>div{
                position: relative;
                img{
                  width: 36px;
                  position: relative;
                  z-index: 1;
                  &:last-of-type{
                    margin-left: -12px;
                    z-index: 0;
                  }
                }
              }
              p{
                font-size: 18px;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 22px;
                margin-left: 16px;
              }
            }
          }
          .van-cell__right-icon{
            color: #fff;
            font-size: 20px;
            line-height: 36px;
          }
        }
        .van-collapse-item__content{
          background: rgba(107, 110, 119, .8);
          padding: 0 24px;
          padding-bottom: 24px;
          .collapseContent{
            .data{
              display: flex;
              flex-direction: row;
              box-sizing: border-box;
              padding:  0 ;
              margin-bottom: 32px;
              &>div{
                flex: 1;
                overflow: hidden;
                &>span{
                  color: rgba(255, 255, 255, .6);
                  font-size: 16px;
                  line-height: 20px;
                }
                p{
                  margin-top: 12px;
                  font-size: 23px;
                  font-weight: bold;
                  color: #FFFFFF;
                  line-height: 28px;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  box-sizing: border-box;
                  padding:  0 ;
                  &>span{
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
              }
            }
            
            .btns{
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              box-sizing: border-box;
              padding:  0 ;
              div{
                width: 160px;
                height: 56px;
                line-height: 54px;
                box-sizing: border-box;
                text-align: center;
                border-radius: 16px;
                font-size: 16px;
                font-weight: bold;
                color: #FFFFFF;
                margin-right:16px ;
                border: 1px solid #A2A5B2;
                flex: .55;
                cursor: pointer;
                &.add{
                  margin: 0;
                  flex: 1;
                  background: #393A3E;
                  border: 1px solid #393A3E;
                }
              }
            }
            @media screen and (max-width: 600px){
              .data{
                margin-bottom: 12px;
                &>div{
                  flex: 1;
                  span{
                    color: rgba(255, 255, 255, .6);
                    font-size: 12px;
                    line-height: 12px;
                  }
                  p{
                    margin-top: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #FFFFFF;
                    line-height: 16px;
                  }
                }
              }
              .btns{
                div{
                  width: 160px;
                  height: 46px;
                  line-height: 44px;
                }
              }
            }
          }
        }
        
      }
    }
  }
}
</style>