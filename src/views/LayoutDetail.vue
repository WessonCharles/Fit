<template>
  <div class="col-xs-12">
    <p class="calendartitle">{{currentDate}}</p>
    <div class="row">
      <div class="col-xs-5"></div>
      <div class="col-xs-5"></div>
      <div class="col-xs-2"></div>
      <div class="clearfix"></div>
    </div>
  </div>
  <div class="clearfix"></div>
</template>

<script>
import calendar from '../components/Calendar.vue'

export default {
  data(){
    return {
      currentDate:''
    }
  },
  created(){
    var t = this;
    var nd = new Date();
    var week = "周" + "日一二三四五六".split("")[nd.getDay()];
    var date = new Date().toLocaleDateString();
    t.currentDate = week+" "+date;
    console.log(t.currentDate)
  },
  components: {
    calendar
  },
  methods:{
    
  }
}
</script>
