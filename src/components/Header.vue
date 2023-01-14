<template>
  <div class="Header" @click="$refs.User.hideNetList()">
    <div>
      <img src="../assets/img/swap-logo.png" alt="">
      <ul>
        <li :class="routePath=='/'&&'active'"  @click="goPage('/')">{{ $t('header[0]') }}</li>
        <li :class="routePath.indexOf('/Pool')>-1&&'active'" @click="goPage('/pool')">{{ $t('header[1]') }}</li>
        <li :class="routePath.indexOf('/Mining')>-1&&'active'" @click="goPage('/Mining')">{{ $t('header[2]') }}</li>
        <li :class="routePath.indexOf('/farm')>-1&&'active'" @click="goPage('/farm')">{{ $t('header[4]') }}</li>
        <li :class="routePath.indexOf('/bridge')>-1&&'active'" @click="goPage('/bridge')">{{ $t('header[5]') }}</li>
        <!-- <li>Charts</li> -->
      </ul>
    </div>
    <div>
      <User ref="User"></User>
      <img class="btn" @click="Settings"  src="../assets/img/setting.svg" alt="">
      <div @mouseleave="isShowSelectLang = false"
           @mouseenter="isShowSelectLang = true"
           class="btn-switch-lan">
        <p>{{ lanTextList[$i18n.locale].text }}</p>
        <transition name="lang-select-fade">
          <div v-show="isShowSelectLang" class="select-lan-box">
            <p v-for="(lan, i) in lanTextList" :key="'lan'+i" @click="switchLan(lan.id)">
              {{ lan.text }}
            </p>
          </div>
        </transition>
      </div>

      <!-- h5显示的侧拉菜单按钮 -->
      <div @click="isShowH5Menu = true" class="h5-fold">
        <i class="el-icon-s-operation"></i>
      </div>
    </div>
    <TransactionSettings ref="TransactionSettings"></TransactionSettings>
    <van-popup
        v-model="isShowH5Menu"
        position="right"
        get-container="Header"
        :overlay-style="{backgroundColor: 'rgba(0,0,0,.5)'}">
      <div class="h5-menu">
        <div class="header"></div>
        <div @click="goPage('/')" class="menu-item">
          <p>{{ $te('header_en[0]') ? $t('header_en[0]') : $t('header[0]') }}</p>
        </div>
        <div @click="goPage('/Pool')" class="menu-item">
          <p>{{ $te('header_en[1]') ? $t('header_en[1]') : $t('header[1]') }}</p>
        </div>
        <div @click="goPage('/Mining')" class="menu-item">
          <p>{{ $te('header_en[2]') ? $t('header_en[2]') : $t('header[2]') }}</p>
        </div>
        <div @click="goPage('/farm')" class="menu-item">
          <p>{{ $te('header_en[4]') ? $t('header_en[4]') : $t('header[4]') }}</p>
        </div>
        <div @click="goPage('/bridge')" class="menu-item">
          <p>{{ $te('header_en[5]') ? $t('header_en[5]') : $t('header[5]') }}</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import TransactionSettings from '@/components/TransactionSettings.vue'
import User from '@/components/User.vue'
export default {
  name: 'Header',
  components:{User,TransactionSettings},
  props: {
    msg: String
  },
  data() {
    return {
      isShowH5Menu: false,  // 是否显示h5侧拉菜单
      isShowSelectLang: false,  // 是否显示选择语言菜单
      routePath:'/',
      lanTextList: {
        en: {
          text: 'English',
          id: 'en'
        },
        cn: {
          text: '繁體中文',
          id: 'cn'
        },
        pt: {
          text: 'português',
          id: 'pt'
        },
        rn: {
          text: 'русский',
          id: 'rn'
        }
      }
    }
  },
  mounted(){
    this.routePath = this.$route.path
  },
  methods:{
    switchLan (lan) {
      if (lan === this.$i18n.locale) {
        return false
      }
      localStorage.setItem('zooswap-lang', lan)
      this.$i18n.locale = lan
      location.reload()
    },
    goPage(path){
      if(this.routePath!=path){
        this.$router.push({
            path:path
          })
      }
    },
    Settings(){
      this.$refs.TransactionSettings.show()
    },
  },
  watch:{
    '$route':function(to,from){
      this.routePath = to.path
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Header{
  position: relative;
  z-index: 2;
  .lang-select-fade-enter-active {
    transition: all .3s ease;
  }
  .lang-select-fade-leave-active {
    // transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transition: all .3s;
  }
  .lang-select-fade-enter {
    transform: translateY(-20px);
    // height: 500px;
    opacity: 0;
  }
  .lang-select-fade-leave-to {
    transform: translateY(-120px);
    // height: 500px;
    opacity: 0;
  }
  width: 100%;
  // height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding:  16px 32px ;
  &>div{
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    padding:  0 ;
    ul{
      display: flex;
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-left: 16px;
      li{
        padding: 0 16px;
        cursor: pointer;
        color: rgba(255, 255, 255, .6);
        font-size: 16px;
        &.active{
          color: rgba(255, 255, 255, 1);
          font-weight: 500;
        }
      }
    }
    div.btn{
      font-size: 16px;
      font-weight: 500;
      padding: 0 14px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      background: rgba(255, 255, 255, .29);
      border-radius: 12px;
      color: #fff;
      margin-right: 20px;
    }
    img.btn{
      cursor: pointer;
      height: 40px;
      margin-left: 20px;
    }
  }
  .btn-switch-lan {
    cursor: pointer;
    width: 113px;
    height: 40px;
    background: rgba(255, 255,255, .29);
    border-radius: 12px;
    margin-left: 20px;
    position: relative;
    font-size: 16px;
    font-family: AlibabaPuHuiTi_2_65_Medium;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    .select-lan-box {
      background: rgba(255, 255,255, .29);
      width: 113px;
      height: 160px;
      border-radius: 12px;
      position: absolute;
      left: 0;
      top: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      cursor: pointer;
      p {
        width: 100%;
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-radius: 12px;
        &:hover {
          background: rgba(255, 255,255, .5);
        }
      }
    }
  }
  .h5-fold {
    width: 32px;
    height: 32px;
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    text-align: center;
    display: none;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  @media screen and (max-width: 600px){
    padding: 8px 16px;
    .h5-fold {
      display: flex;
    }
    .btn-switch-lan {
      display: none;
    }
    &>div{
      img{
        height: 16px;
        &.btn{
          height: 32px;
          margin-left: 10px;
        }
      }
      ul{
        display: none;
      }
    }
  }

  /deep/ .van-popup {
    width: 50%;
    height: 100%;
    background: none;
    .h5-menu {
      background: #565A66;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0 24px;
      & > div {
        width: 100%;
      }
      .header {
        height: 44px;
      }
      .menu-item {
        color: #ffffff;
        margin-top: 24px;
        display: flex;
        align-items: center;
        font-size: 16px;
      }
    }
  }
}
</style>
