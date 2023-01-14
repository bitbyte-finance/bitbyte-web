<template>
  
  <van-popup v-model="widgetVisible" position="center" get-container="body"  
    :overlay-style="{backgroundColor: 'rgba(0,0,0,0.5)'}" 
    class='Invite'>
    
    <div>
      
      <div class="top">
        <p>{{ $t('user.invite[3]') }}</p>
        <img @click="widgetVisible=false" src="../assets/img/close.svg" alt="">
      </div>
      <img src="../assets/img/invite.png" alt="">
      <div class="info">
        <template v-if="invteAddress">
          <h3>{{ $t('user.invite[4]') }}:{{invteAddress.substring(0,6)}}....{{ invteAddress.substring(invteAddress.length-4,invteAddress.length) }}</h3>
          <p>{{ $t('user.invite[5]') }}</p>
          <div class="bind active" v-clipboard:copy="inviteLink" v-clipboard:success="copySuccess" v-clipboard:error="copyError"> {{ $t('user.invite[6]') }} </div>
        </template>
        <template v-else>
          <h3>{{ $t('user.invite[7]') }}</h3>
          <p>{{ $t('user.invite[8]') }}</p>
          <div class="inputBox">
            <div class="input"><input type="text" v-model="address" :placeholder="$t('user.invite[2]')"></div>
            <div class="clear" v-if="address" @click="address=''">
              <img  src="../assets/img/close.svg" alt="">
            </div>
          </div>
          <div class="bind" :class="address&&address.length===42&&'active'" @click="nodeParent('click')">{{ $t('user.invite[3]') }} <span v-if="inviteLoading" class="loading" ></span> </div>
        </template>
      </div>
      <div class="mask" v-if="isInvteloading">
        <div class="loading"></div>
      </div>
    </div>
  </van-popup>
  
</template>
<script>
import { mapMutations,mapState } from "vuex";
export default {
  components: {},
  computed:{ ...mapState(['userInfo','records']),},
  data() {
    return {
      inviteLoading:false,
      isInvteloading:false,
      invteAddress:'',
      widgetVisible:false,
      address:'',
      inviteLink:'',
    };
  },
  mounted() {
    setTimeout(()=>{
      
      if(this.$route.query.invite){
        console.log(this.$route.query)
        localStorage.setItem('inviteCode',this.$route.query.invite)
        localStorage.setItem('inviteNetwork',this.$route.query.networkId)
      }
    },1000)
  },
  methods: {
    ...mapMutations([ "setUserInfo","setRecords",'resetRecords']),
    show(){
      if(localStorage.getItem('inviteCode')&&localStorage.getItem('inviteNetwork')===this.userInfo.networkId ){
        this.address = localStorage.getItem('inviteCode')
      }else{
        this.address = ''
      }
      this.invteAddress = ''
      this.isInvteloading = true
      this.nodeParent('frist')
      this.widgetVisible=true
      this.inviteLink = `${window.location.origin}/#/?networkId=${this.userInfo.networkId}&invite=${this.userInfo.address}`
    }, 
    copySuccess(e) {  this.$toast(this.$t('user.invite[9]') ) },
    copyError(e) {  this.$toast(this.$t('toast[1]')) },
    invite(){
      if(!this.address||this.address.length!==42||this.inviteLoading){
        return
      }
      this.inviteLoading = true
      this.miningContract.invite_new(this.address,res=>{
          console.log(res)
        if(res.code === 200){
          let obj = {
            hash:res.data,
            type:'invite',
            state:1,
            address:this.address,
            msg:`Bind ${this.address.substring(0,6)}...${ this.address.substring(this.address.length-4,this.address.length) }`
          }
          this.setRecords(obj)
          this.address = ''
          this.widgetVisible = false
          this.$toast('Transaction has been submitted')
          this.widgetVisible = false
          localStorage.removeItem('inviteCode')
          localStorage.removeItem('inviteNetwork')
          this.$parent.showFloat = false
        }else{
          this.$toast('Binding failed')
        }
        this.inviteLoading = false
      })
    },
    nodeParent(type){
      //click:点击绑定按钮前查询输入地址是否为用户的下级地址
      //frist:打开邀请弹窗时查询当前帐号是否有绑定上级用户
      //watch:切换网络、帐号时查询当前帐号是否有绑定上级用户
      if(type == 'click'){
        if((this.address.length!==42||this.inviteLoading)){
          return
        }else if(this.ercMethods.toAddress(this.address) === this.ercMethods.toAddress(this.userInfo.address) ){
          this.$alert({
            title: this.$t('alert.point[0]'),
            message: this.$t('user.invite[10]'),theme: 'round-button',
            confirmButtonColor:'#2B7EFF',
            confirmButtonText: this.$t('alert.point[1]')
          })
          return
        }
      }
      this.miningContract.parentOf(type === 'click'?this.address:this.userInfo.address)
        .then(res => {
          if(type === 'click'){
            if(this.ercMethods.toAddress(res)=== this.ercMethods.toAddress(this.userInfo.address) ){
              this.$alert({
                title: this.$t('alert.point[0]'),
                message: this.$t('user.invite[11]'),theme: 'round-button',
                confirmButtonColor:'#2B7EFF',
                confirmButtonText: this.$t('alert.point[1]')
              })
            }else{
              this.invite()
            }
          }else if(type === 'frist'){
            localStorage.removeItem('inviteCode')
            localStorage.removeItem('inviteNetwork')
            this.$parent.showFloat = false
            this.invteAddress = res
          }
          this.isInvteloading = false
        })
        .catch(e => {
          this.invteAddress = ''
          if(type === 'watch'){
            this.$parent.showFloat = true
            this.show()
          }else if(type === 'click'){
            this.invite()
          }
          this.isInvteloading = false
        })
      /*this.miningContract.nodeParent(type == 'click'?this.address:this.userInfo.address,res=>{
        if(res.code === 200){
          if(type == 'click'){
            if(this.ercMethods.toAddress(res.data)=== this.ercMethods.toAddress(this.userInfo.address) ){
              this.$alert({
                title: this.$t('alert.point[0]'),
                message: this.$t('user.invite[11]'),theme: 'round-button',
                confirmButtonColor:'#2B7EFF',
                confirmButtonText: this.$t('alert.point[1]')
              })
            }else{
              this.invite()
            }
          }else if(type == 'frist'){
            console.log(res)
            debugger
            localStorage.removeItem('inviteCode')
            localStorage.removeItem('inviteNetwork')
            this.$parent.showFloat = false
            this.invteAddress = res.data
          }
        }else{
          this.invteAddress = ''
          if(type == 'watch'){
            this.$parent.showFloat = true
            this.show()
          }else if(type == 'click'){
            this.invite()
          }
        }
        this.isInvteloading = false
      })*/
    },
  },
  watch:{
    "userInfo.address": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue&&newValue!=oldValue&&localStorage.getItem('inviteCode')&&localStorage.getItem('inviteNetwork')===this.userInfo.networkId ){
          this.address = localStorage.getItem('inviteCode')
          this.nodeParent('watch')
        }
      }
    },
    "userInfo.networkId": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue&&newValue!=oldValue&&localStorage.getItem('inviteCode')&&localStorage.getItem('inviteNetwork')===this.userInfo.networkId ){
          this.address = localStorage.getItem('inviteCode')
          this.nodeParent('watch')
        }
      }
    },
    
  }
};
</script>
<style lang='less' scoped>
.Invite{
  background: rgba(0,0,0,0);
  top:250px;
  transform:translate3d(-50%,0,0);
  &>div{
    background: linear-gradient(180deg, #848998 0%, #565A66 100%);
    border-radius: 12px;
    width: 400px;
    
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    &>img{
      width: 100%;
      margin-top: -50px;
      position: relative;
      z-index: 0;
    }
    .top{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      padding: 24px;
      padding-bottom: 0;
      position: relative;
      z-index: 1;
      p{
        font-size: 18px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
      }
      img{
        width: 26px;
        height: 26px;
        position: relative;
        top: -4px;
        right: -4px;
        cursor: pointer;
      }
    }
    .info{
      padding: 24px;
      padding-top: 0;
      &>h3{
        font-size: 16px;
        line-height: 20px;
        color: #fff;
      }
      &>p{
        font-size: 12px;
        // font-weight: 500;
        color: rgba(255, 255, 255, .8);
        line-height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        margin-bottom: 20px;
        font-weight: normal;
        margin-top: 16px;
      }
      &>span{
        color: #fff;
        font-size: 12px;
      }
      .inputBox{
        margin-top: 12px;
        background:rgba(72, 76, 95, .8) ;
        border-radius: 12px;
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        margin-top: 60px;
        &>.input{
          flex: 1;
          input{
            height: 48px;
            box-sizing: border-box;
            width: 100%;
            outline: none;
            border:none;
            color: #fff;
            font-size: 12px;
            padding-left: 10px;
            background: transparent;
            &::placeholder{
              color: rgba(255, 255, 255, .6);
            }
          }
        }
        &>.clear{
          width: 38px;
          height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          img{
            width: 20px;

            background: #565A66;
            border-radius: 50%;
          }
        }
      }
      
      &>.bind{
        text-align: center;
        line-height: 56px;
        margin-top: 20px;
        color: #fff;
        height: 56px;
        background: #2C3249;
        border-radius: 12px;
        cursor: default;
        user-select: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        span{
          margin-left: 10px;
        }
        &.active{
          cursor: pointer;
          background:rgba(59, 153, 252, 1) ;
        }
      }
    }
    
    &>.mask{
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      left: 0;
      top: 0;
      background:#70727B ;
      div{
        width: 60px;
        height: 60px;
      }
    }
    
  }
  @media screen and (max-width: 600px){
    width: 100%;
    top: 100px;
    &>div{
      width: 92%;
      margin: 0 auto;
      
        
    }
  }
}
</style>