<template>
  <div id="wrapper">
        <div class="header">
            <div class="logo">
              <img src="src/assets/logo_01.png" alt="今日训练">
            </div>
            <div class="rightmenu">
              <div class="userinfo">
                <img src="" alt="">
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
        <div class="container">
          
        </div>
    </div>
</template>

<script>
import dropdown from './components/Dropdown.vue'

export default {
  components: {
    dropdown
  },
  ready() {

  },
  data (){

  }
}
</script>

<style>
</style>

