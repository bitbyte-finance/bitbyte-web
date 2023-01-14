<template>
  <div class="Pool">
    <h3>{{ $t('pool.title') }}</h3>
    <p>{{ $t('pool.subTitle') }}</p>
    <div class="container">
      <div class="nav">
        <p @click="$router.push('/')">{{ $te('header_en[0]') ? $t('header_en[0]') : $t('header[0]') }}</p>
        <p class="active">{{ $te('header_en[1]') ? $t('header_en[1]') : $t('header[1]') }}</p>
        <p @click="$router.push('/Mining')">{{ $te('header_en[2]') ? $t('header_en[2]') : $t('header[2]') }}</p>
        <p @click="$router.push('/farm')">{{ $te('header_en[4]') ? $t('header_en[4]') : $t('header[4]') }}</p>
      </div>
      <div class="tab">
        <div :class="routePath=='/Pool/YourLiquidity'&&'active'" @click="goPage('/Pool/YourLiquidity')">{{ $t('pool.tab[0]') }}</div>
        <!-- <div>Create a pair</div> -->
        <div :class="routePath=='/Pool/AddLiquidity'&&'active'" @click="goPage('/Pool/AddLiquidity')">{{ $t('pool.tab[1]') }}</div>
      </div>
      <div class="content">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pool',
  components: {
    // HelloWorld
  },
  data() {
    return {
     routePath:'',
    }
  },
  mounted() {
    this.routePath = this.$route.path
  },
  watch:{
    '$route':function(to,from){
      this.routePath = to.path
    }
  },
  methods:{
    goPage(path){
      if(this.routePath!=path){
        this.$router.push({
            path:path
          })
      }
    },
  }
}
</script>
<style lang="less" scope>
  .Pool{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding:  0 ;
    &>h3{
      font-size: 34px;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 42px;
      margin-top: 64px;
    }
    &>p{
      font-size: 18px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 22px;
      margin-top: 24px;
    }
    .container{
      width: 544px;
      // height: 573px;
      border-radius: 32px;
      background: rgba(107, 110, 120, .9);
      overflow: hidden;
      margin: 0 auto;
      margin-top: 40px;
      box-shadow: 0px 15px 40px rgba(0, 0, 0, .3);
      position: relative;
      padding: 24px;
      box-sizing: border-box;
      &::after{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, .14);
        border-radius: 32px;
        filter: blur(5px);
        z-index: 0;
      }
      .nav{display: none;}
      &>div{
        position: relative;
        z-index: 1;
      }
      .tab{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  4px ;
        height: 56px;
        background: #565A66;
        border-radius: 20px;
        div{
          flex: 1;
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, .6);
          cursor: pointer;
          &.active{
            background: #2B7EFF;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
            border-radius: 16px;
            color: #fff;
          }
        }
      }
    }
    @media screen and (max-width: 600px){
      &>h3,&>p{
        display: none;
      }
     
      &>.container{
        width: 92%;
        .nav{
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 20px;
          padding-bottom: 10px;
          p{
            position: relative;
            line-height: 40px;
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
             margin-left: 20px;
            &.active{
              color: #fff;
              font-size: 14px;
              cursor: default;
              &::after{
                position: absolute;
                left:0;
                bottom: -10px;
                content: "";
                width: 40px;
                height: 2px;
                background: #fff;

              }
            }
          }
        }
        .tab{
          height: 46px;
          &>div{
            height: 38px;
            line-height: 38px;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
