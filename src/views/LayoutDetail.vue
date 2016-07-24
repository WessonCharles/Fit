<template>
  <div class="col-xs-12">
    <p class="calendartitle">{{currentDate}}</p>
    <div class="row">
      <div class="col-xs-5 segmentdetail">
        <h4>编辑</h4>
        <div class="seglist">
          <div class="segheader">
            <h4>
              <span style="float:left">title</span>
              <div class="segroup">
                <div class="segchild">
                  <input type="text" class="form-control min-height">
                </div>
                <div class="segchild">
                  <input type="text" class="form-control min-height">
                </div>
              </div>
              <a class="removeseg">删除环节</a>
              <div class="clearfix"></div>
            </h4>
            
          </div>
          <div class="actionlist">
            <div class="action">
              <span>aaa</span>
            </div>
            <div class="action">
              <span>bbb</span>
            </div>
            <div class="action">
              <span>ccc</span>
            </div>
            <!-- <div class="addaction">
              
            </div> -->
          </div>
          <div class="operation">
            <a class="addaction"><i class="fa fa-plus"></i>添加动作</a>
            <a class="addmark"><i class="fa fa-rotate-left"></i>修改循环</a>
          </div>
        </div>
        <div class="segadd">
          <a class="choiceseg" @click="showModal.choiceseg = true"><i class="fa fa-plus"></i>选择环节</a>
          <a class="createseg">创建环节</a>
        </div>
      </div>
      <div class="col-xs-5 segmentaction">
        <h4>预览</h4>
        <div class="contenter">
          
        </div>
      </div>
      <div class="col-xs-2 segmentchat">
        <h4>编排分析</h4>
        <div class="contenter">
          
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <div class="clearfix"></div>


  <modal title="选择模式" iscancel="false" isok="true" :callback="addseg" ok-text="添加" effect="zoom" :show.sync="showModal.choiceseg">
        <div class="modal-body" slot="modal-body">
            <tabs :stack="true" :active="0">
              <tab header="FOR TIME">
                  <h3>FOR TIME</h3>
                  <p>描述描述</p>
                  <hr>
                  <h3>Filthy Fifty</h3>
                  <p>For time:</p>
                  <p>50 Box Jumps, 24/20 in</p>
                  <p>50 Jumping Pull-ups</p>
                  <p>50 Kettlebell Swings, 35/26 lbs</p>
                  <p>50 Walking Lunges</p>
                  <p>50 Knees To Elbows</p>
                  <p>50 Push Press, 45/35 lbs</p>
                  <p>50 Back Extensions</p>
                  <p>50 Wall Balls, 20/14 lbs</p>
                  <p>50 Burpees</p>
                  <p>50 Double Unders</p>
                  <hr>
                  <h3>成绩记录</h3>
                  <p>总耗时：10:00</p>
                  <hr>
                  * 无法分析动作个数
              </tab>
              <tab header="RFT">
              </tab>
              <tab header="RFT With Var Rounds">
              </tab>
              <tab header="RFT with Bookends">
              </tab>
              <tab header="Each Round For Time">
              </tab>
              <tab header="EMOM">
              </tab>
              <tab header="Alternating EMOM">
              </tab>
              <tab header="AMRAP">
              </tab>
              <tab header="AMRAP Repeats">
              </tab>
              <tab header="AMRAP With Buy-in">
              </tab>
            </tabs>  
        </div>
    </modal>   
</template>

<script>
import calendar from '../components/Calendar.vue'
import modal from '../components/Modal.vue'
import tabs from '../components/Tabs.vue'
import tab from '../components/Tab.vue'
import fitDB from '../utils/indexedDB.js'

export default {
  data(){
    return {
      currentDate:'',
      plan:{},
      showModal:{
        choiceseg:false,//查找环节
      }
    }
  },
  created(){
    var t = this;
    var nd = new Date();
    var week = "周" + "日一二三四五六".split("")[nd.getDay()];
    var date = new Date().toLocaleDateString();
    t.currentDate = week+" "+date;

  },
  components: {
    calendar,
    modal,
    tabs,
    tab
  },
  ready(){
    var id = localStorage.getItem("currenttpid");
    fitDB.indexedDB.getfitbyid(id,function(obj){
      console.log(obj)
    }) 
  },
  methods:{
    addseg(){//.nav-stacked

    },
  }
}
</script>
