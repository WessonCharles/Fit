<template>
  <div class="col-xs-12">
    <p class="calendartitle">{{currentDate}}</p>
    <calendar :show.sync="show"  :x="x" :y="y"  :range="range" :plans="plans"></calendar>
  </div>
  <div class="clearfix"></div>
</template>

<script>
import calendar from '../components/Calendar.vue'
import fitDB from '../utils/indexedDB.js'

export default {
  data(){
    return {
      show:true,
      type:"date",
      x:0,
      y:0,
      range:false,
      currentDate:'',
      plans:[]
    }
  },
  created(){
    var that = this;
    var nd = new Date();
    var week = "周" + "日一二三四五六".split("")[nd.getDay()];
    var date = new Date().toLocaleDateString();
    that.currentDate = week+" "+date;

    fitDB.indexedDB.open(function(datas){
      that.plans = datas;
    })
  },
  components: {
    calendar
  },
  methods:{
    
  }
}
</script>

