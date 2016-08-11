<template>
	<div class="col-xs-12">
	    <p class="calendartitle">{{currentDate}}</p>
	    <div class="row">
	      <div class="col-xs-6 indexcontainer">
	        <h4>今日训练 </h4>
	        <div class="contenter"></div>
	      </div>
	      <div class="col-xs-6 indexcontainer">
	        <h4>08:00 CrossFit</h4>
	        <div class="contenter"></div>
	      </div>
	      <div class="clearfix"></div>
	  	</div>
	 </div>
	 <div class="clearfix"></div> 	
</template>

<script>
import modal from '../components/Modal.vue'
import fitDB from '../utils/indexedDB.js'

export default {
  components: {
    modal,
    fitDB
  },
  data(){
    return {
      plans:[],
    }
  },
  ready(){
  	var that =this;
    fitDB.indexedDB.open(function(){
      fitDB.indexedDB.getallfit(function(datas){
        var arr = [];
        for(var i =0;i<datas.length;i++){
        	if(datas[i].ref == new Date().pattern("yyyyMMdd")){
        		arr.push(datas[i]);
        	}
        }
        that.plans = arr.sort(function(a,b){
        	return a.tpid>b.tpid?1:-1;
        })
        console.log(that.plans);
      });
    });
    // this.$router.go({name:"index"})
  },
  methods:{
    
  }
}
</script>