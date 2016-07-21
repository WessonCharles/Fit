<template>
  <div id="wrapper">
        <div class="header">
            <div class="logo">
              <a href="/"><img src="./assets/logo.png" alt="今日训练"></a>
            </div>
            <div class="rightmenu">
              <div class="userinfo">
                <img src="./assets/avator.png" alt="">
                <div class="dropdown-btn">
                  <dropdown>
                    <a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      李教练 <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                    </ul>
                  </dropdown>    
                </div>
              </div>
              <div class="head-tools">
                <ul>
                  <li><i class="fa fa-search"></i></li>
                  <li><i class="fa fa-edit"></i></li>
                  <li><i class="fa fa-bell"></i></li>
                </ul>
              </div>
            </div>
        </div>
        <div class="containers">
          <div class="sidebar">
            <div class="side-title">
              
              <a><img src="./assets/avator.png" alt=""><span>Crossfit PowerSonic</span></a>
            </div>
            <div class="side-route">
              <p class="route-title">训练</p>
              <ul>
                <li class="{{url=='/'?'active':''}}" @click="seturl($event,'/')">
                  <a v-link="'/'"><i class="fa fa-dashboard"></i><span>321 GO!</span></a>
                </li>
                <li class="{{url.indexOf('/layout')>-1?'active':''}}" @click="seturl($event,'/layout')">
                  <a v-link="'/layout'"><i class="fa fa-edit"></i><span>编排</span></a>
                </li>
              </ul>
            </div>
            <div class="side-route">
              <p class="route-title">会员</p>
              <ul>
                <li>
                  <a href=""><i class="fa fa-trophy"></i><span>排名</span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="content">
            <router-view></router-view>
          </div>
        </div>
    </div>
</template>

<script>
import dropdown from './components/Dropdown.vue'

export default {
  components: {
    dropdown
  },
  data(){
    return {
      url:window.location.pathname
    }
  },
  methods:{
    seturl(e,url){
      e.stopPropagation();
      console.log(url)
      this.url = url;
    }
  }
}
</script>

