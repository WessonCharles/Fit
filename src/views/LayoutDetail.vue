<template>
  <div class="col-xs-12">
    <p class="calendartitle">{{currentDate}}</p>
    <div class="row">
      <div class="col-xs-5 segmentdetail">
        <h4>编辑 </h4>
        <div class="seglist" v-for="sec in plan.sections">
          <div class="segheader">
            <h4>
              <span style="float:left" v-if="!edittitle">{{sec.name}}</span>
              <input style="float:left;width:60px;" class="form-control min-height" v-if="edittitle" v-model="sec.name" @keyup.enter="updatesec($event,sec.secid,{'name':sec.name});">
              <i class="fa fa-pencil edittitle" v-if="!edittitle" @click="edittitle = !edittilte"></i>
              <div class="segroup">
                <div class="segchild">
                  <input type="text" placeholder="计时方式" v-if="!editsegtype" class="form-control min-height">
                  <span v-if="editsegtype"></span>
                </div>
                <i class="fa fa-pencil editsegtype" v-if="editsegtype" @click="editsegtype=false;"></i>
                <div class="segchild">
                  <input type="text" placeholder="时长" v-if="!edittime" class="form-control min-height">
                  <span v-if="edittime"></span>
                </div>
                <i class="fa fa-pencil edittime" v-if="edittime" @click="edittime = false;"></i>
              </div>
              <a class="removeseg" @click="removeseg(sec.secid)">删除环节</a>
              <div class="clearfix"></div>
            </h4>
            
          </div>
          <div class="actionlist">
            <div class="action {{actiontype(mov.action.type)}}" v-for="mov in sec.movements">
              <i class="fa fa-pencil edit" @click.stop.prevent="seteditaction(mov.tmid,sec.secid)"></i>
              <span style="color:#fff;font-size:18px;">{{mov.action.name}}</span><span style="margin-left:30px;" class="replaceaction" v-if="mov.replaceAction">替换动作：{{mov.replaceAction.name}}</span>
            </div>
            <div class="addaction" v-if="showModal.addaction">
              <span style="float:left">添加动作</span><input style="width:55%;margin-top:-2px!important;" type="text" class="form-control min-height" v-model="nacname"> <button class="btn btn-sm btn-primary" @click="addactiontoseg($event,sec.secid)">添加</button> <a class="nounder" @click="showModal.addaction = false;">取消</a>
            </div>
          </div>
          <div class="operation">
            <a class="addaction" @click="showModal.addaction = true"><i class="fa fa-plus"></i>添加动作</a>
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
          <div class="seglist" v-for="sec in plan.sections">
            <div class="segheader">
              <h4>
                <span style="float:left" v-if="!edittitle">{{sec.name}} <small style="margin-left:15px;color:#fff">(<b style="margin:0 2px;">{{sec.type}}</b>)</small></span>
                <div class="clearfix"></div>
              </h4>
            </div>
            <div class="actionviewlist" v-show="$index==0">
              <div class="action {{actiontype(mov.action.type)}}" v-for="mov in sec.movements">
                <div class="col-xs-12">
                  <table class="viewaction table noborder">
                    <thead>
                      <tr>
                        <td colspan="10"><span style="color:#fff;font-size:18px;margin-right:15px;">{{mov.action.name}}</span> <strong><a class="text-red">{{mov.action.reps||'0'}}</a>次</strong></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="spe in mov.action.spec" v-if="!spe.male">
                        <td>等级：{{spe.name}}</td>
                        <td>所有人</td>
                        <td>
                          <span v-if="spe.man.lb">重量- <a class="text-red">{{spe.man.lb}}</a></span><span v-if="spe.man.in">高度-<a class="text-red">{{spe.man.in}}</a></span>
                        </td>
                      </tr>
                      <tr v-for="spe in mov.action.spec" v-if="spe.male">
                        <td>等级：{{spe.name}}</td>
                        <td>男</td>
                        <td>
                          <span v-if="spe.male.lb">重量-<a class="text-red">{{spe.male.lb}}</a></span><span v-if="spe.male.in">高度-<a class="text-red">{{spe.male.in}}</a></span>
                        </td>
                        <td></td>
                        <td>女</td>
                        <td>
                          <span v-if="spe.female.lb">重量-<a class="text-red">{{spe.female.lb}}</a></span><span v-if="spe.female.in">高度-<a class="text-red">{{spe.female.in}}</a></span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="10"><b>成绩记录方式：</b><strong>{{mov.action.score=='amount'?'数量':'时间'}}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                  <p  v-if="mov.replaceAction&&mov.replaceAction.name">替换动作</p>
                  <table  class="viewaction table noborder" v-if="mov.replaceAction&&mov.replaceAction.name">
                    <thead>
                      <tr>
                        <td colspan="10"><span style="color:#fff;font-size:18px;margin-right:15px;">{{mov.replaceAction.name}}</span> <strong><a class="text-red">{{mov.replaceAction.reps||'0'}}</a>次</strong></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="spe in mov.replaceAction.spec" v-if="!spe.male">
                        <td>等级：{{spe.name}}</td>
                        <td>所有人</td>
                        <td>
                          <span v-if="spe.man.lb">重量-<a class="text-red">{{spe.man.lb}}</a></span><span v-if="spe.man.in">高度-<a class="text-red">{{spe.man.in}}</a></span>
                        </td>
                      </tr>
                      <tr v-for="spe in mov.replaceAction.spec" v-if="spe.male">
                        <td>等级：{{spe.name}}</td>
                        <td>男</td>
                        <td>
                          <span v-if="spe.male.lb">重量-<a class="text-red">{{spe.male.lb}}</a></span><span v-if="spe.male.in">高度-<a class="text-red">{{spe.male.in}}</a></span>
                        </td>
                        <td></td>
                        <td>女</td>
                        <td>
                          <span v-if="spe.female.lb">重量-<a class="text-red">{{spe.female.lb}}</a></span><span v-if="spe.female.in">高度-<a class="text-red">{{spe.female.in}}</a></span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="10"><b>成绩记录方式：</b><strong>{{mov.replaceAction.score=='amount'?'数量':'时间'}}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="sectionreps">
                2,4,6
              </div>
            </div>
          </div>
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
            <tabs :stack="true" :active="0" :select="activeseg">
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
  <modal title="动作设置" class="actionform" iscancel="false" isok="true" :callback="updateactions" :btns="btns" ok-text="完成" effect="zoom" :show.sync="showModal.updateaction">
        <div class="modal-body" slot="modal-body">
          <fieldset>
            <h5 style="margin-top:0;">
              <span class="col-xs-2">动作名:</span>
              <div class="col-xs-10">
                <input class="form-control col-xs-9 min-height" v-model="editingactionobj.action.name">
              </div>
              <div class="clearfix"></div>
            </h5>
            <div class="form-group">
              <label class="col-xs-2">重复</label>
              <div class="col-xs-10" style="line-height:25px;">
                <input type="text" class="form-control col-xs-9 min-height" v-model="editingactionobj.action.reps">次
              </div>
            </div>
          </fieldset>
          <fieldset>
            <div class="form-group">
              <div class="col-xs-4"><input type="radio" name="spec" value="Rx/Scale" v-model="specad">Rx/Scale </div>
              <div class="col-xs-4"><input type="radio" name="spec" value="L1-L4" v-model="specad">L1-L4 </div>
              <div class="col-xs-4"><input type="checkbox" name="sex" v-model="sex">男女分别制定</div>
              <div class="clearfix"></div>
            </div>
            <div class="form-group">
              <label class="col-xs-2">训练要求</label>
              <div class="col-xs-10">
                <table class="noborder spectable">
                  <thead>
                    <tr>
                      <th style="padding: 10px;text-align:center;">级别</th>
                      <th style="padding: 10px;text-align:center;">重量</th>
                      <th style="padding: 10px;text-align:center;">高度</th>
                      <td style="padding: 10px;text-align:center;"></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="spe in specs">
                      <td>
                        <p><input type="text" class="form-control col-xs-6 min-height" v-model="spe.name"></p>
                      </td>
                      <td>
                        <p v-if="!sex"><input type="text" class="form-control col-xs-8 min-height" v-model="spe.man.lb">lb</p>
                        <div class="col-xs-12 nopadding" v-if="sex">
                          <div class="col-xs-6 nopadding">
                            <label class="col-xs-3 nopadding">男</label>
                            <input type="text" class="form-control col-xs-5 min-height" v-model="spe.male.lb">
                          </div>
                          <div class="col-xs-6 nopadding">
                            <label class="col-xs-3 nopadding">女</label>
                            <input type="text" class="form-control col-xs-5 min-height" v-model="spe.female.lb">lb
                          </div>
                        </div>
                      </td>
                      <td>
                        <p v-if="!sex"><input type="text" class="form-control col-xs-8 min-height" v-model="spe.man.in">in</p>
                        <div class="col-xs-12 nopadding" v-if="sex">
                          <div class="col-xs-6 nopadding">
                            <label class="col-xs-3 nopadding ">男</label>
                            <input type="text" class="form-control col-xs-5 min-height" v-model="spe.male.in">
                          </div>
                          <div class="col-xs-6 nopadding">
                            <label class="col-xs-3 nopadding">女</label>
                            <input type="text" class="form-control col-xs-5 min-height" v-model="spe.female.in">in
                          </div>
                        </div>
                      </td>
                      <td><p v-if="$index!=0"><i class="fa fa-trash" @click="dupspec($index)"></i></p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="clearfix"></div>
            </div>
            
            <p><a class="pull-right" @click="addspec()">添加等级</a></p>
          </fieldset>
          <fieldset>
            <div class="form-group">
              <label class="col-xs-2">记录成绩</label>
              <div class="col-xs-10">
                <div class="col-xs-4"><input type="radio" value="amount" v-model="score">重量 </div>
                <div class="col-xs-4"><input type="radio" value="times" v-model="score">时间</div>
              </div> 
              <div class="clearfix"></div>
            </div> 
          </fieldset>
 
          <div class="replaceact" v-if="showreplaceform">
            <hr>
            <legend style="margin:0;">替换动作</legend>
            <fieldset>
              <h5 style="margin-top:0;">
                <span class="col-xs-2">动作名：</span>
                <div class="col-xs-10">
                    <input type="text" class="form-control col-xs-9 min-height" v-model="editingactionobj.replaceAction.name">
                </div>
                <div class="clearfix"></div>
              </h5>
              <div class="form-group">
                <label class="col-xs-2">重复</label>
                <div class="col-xs-10" style="line-height:25px;">
                  <input type="text" class="form-control col-xs-9 min-height" v-model="editingactionobj.replaceAction.reps">次
                </div>
                <div class="clearfix"></div>
              </div>
            </fieldset>
            <fieldset>
              <div class="form-group">
                <div class="col-xs-4"><input type="radio" name="spec" value="Rx/Scale" v-model="replspecad">Rx/Scale </div>
                <div class="col-xs-4"><input type="radio" name="spec" value="L1-L4" v-model="replspecad">L1-L4 </div>
                <div class="col-xs-4"><input type="checkbox" name="replsex" v-model="replsex">男女分别制定 </div>
                <div class="clearfix"></div>
              </div>
              <div class="form-group">
                <label class="col-xs-2">训练要求</label>
                <div class="col-xs-10">
                   <table class="noborder spectable">
                    <thead>
                      <tr>
                        <th style="padding: 10px;text-align:center;">级别</th>
                        <th style="padding: 10px;text-align:center;">重量</th>
                        <th style="padding: 10px;text-align:center;">高度</th>
                        <td style="padding: 10px;text-align:center;"></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="spe in replspecs">
                        <td>
                          <p><input type="text" class="form-control col-xs-6 min-height" v-model="spe.name"></p>
                        </td>
                        <td>
                          <p v-if="!replsex"><input type="text" class="form-control col-xs-8 min-height" v-model="spe.man.lb">lb</p>
                          <div class="col-xs-12 nopadding" v-if="replsex">
                            <div class="col-xs-6 nopadding">
                              <label class="col-xs-3 nopadding">男</label>
                              <input type="text" class="form-control col-xs-5 min-height" v-model="spe.male.lb">
                            </div>
                            <div class="col-xs-6 nopadding">
                              <label class="col-xs-3 nopadding">女</label>
                              <input type="text" class="form-control col-xs-5 min-height" v-model="spe.female.lb">lb
                            </div>
                          </div>
                        </td>
                        <td>
                          <p v-if="!replsex"><input type="text" class="form-control col-xs-8 min-height" v-model="spe.man.in">in</p>
                          <div class="col-xs-12 nopadding" v-if="replsex">
                            <div class="col-xs-6 nopadding">
                              <label class="col-xs-3 nopadding ">男</label>
                              <input type="text" class="form-control col-xs-5 min-height" v-model="spe.male.in">
                            </div>
                            <div class="col-xs-6 nopadding">
                              <label class="col-xs-3 nopadding">女</label>
                              <input type="text" class="form-control col-xs-5 min-height" v-model="spe.female.in">in
                            </div>
                          </div>
                        </td>
                        <td><p v-if="$index!=0"><i class="fa fa-trash" @click="duprepl($index)"></i></p></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="clearfix"></div>
              </div>
             
              <p><a class="pull-right" @click="addrepl()">添加等级</a></p>
            </fieldset>
            <fieldset>
              <div class="form-group">
                <label class="col-xs-2">记录成绩</label>
                <div class="col-xs-10">
                  <div class="col-xs-4"><input type="radio" value="amount" v-model="replscore">重量</div> 
                  <div class="col-xs-4"><input type="radio" value="times" v-model="replscore">时间</div>
                </div>
                <div class="clearfix"></div>  
              </div>  
            </fieldset>
          </div>  
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
        addaction:false,//创建动作
        updateaction:false//编辑动作
      },

      showreplaceform:false,
      btns:{
        "replaceaction":{
          text:"添加替换动作",
          func:function(){}
        },

      },

      selectedseg:'FOR TIME',
      edittitle:false,
      editsegtype:false,
      edittime:false,
      nacname:'',//新建动作名称

      editingsec:'',//正在编辑的环节
      editingaction:'',//正在编辑的动作
      editingactionobj:{
        action:{},
        replaceAction:{}
      },//正在编辑的动作详细

      specs:[
      {name:"RX",man:{
        lb:0,
        in:0
      }}],
      replspecs:[
      {name:"RX",man:{
        
        lb:0,
        in:0
      }}],
      actionparams:{},//编辑的动作字段
      showreplaceform:false,
      specad:"Rx/Scale",
      replspecad:"Rx/Scale",
      sex:false,
      replsex:false,
      score:false,
      replscore:false,
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
    var that =this;
    fitDB.indexedDB.open(function(){
      var id = localStorage.getItem("currenttpid");
      fitDB.indexedDB.getfitbyid(id,function(obj){
        that.plan = obj;
      });
    });

    that.$watch("sex",function(val){
      if(val){
        that.specs = [{
          name:"RX",
          male:{
            lb:0,
            in:0
          },
          famale:{
            lb:0,
            in:0
          }
        }]
      }
    })

    that.$watch("replsex",function(val){
      console.log(val)
      if(val){
        that.replspecs = [{
          name:"RX",
          male:{
            lb:0,
            in:0
          },
          female:{
            lb:0,
            in:0
          }
        }]
      }
    })

    that.btns["replaceaction"].func = function(){
      that.showreplaceform = !that.showreplaceform;
      that.btns["replaceaction"].text = that.showreplaceform?"取消替换动作":"添加替换动作";
    } 
  },
  methods:{
    addseg(){//增加环节
      var that = this;
      var id = localStorage.getItem("currenttpid");
      console.log(that.selectedseg)
      fitDB.indexedDB.getfitbyid(id,function(obj){//先获取训练计划，再更新循环
        /**
         * 主要方法
         */
        obj.sections.push({
            'secid':new Date().getTime(),
            'name':'Wod'+(obj.sections.length+1),
            'type': that.selectedseg,
            'movements': []
        });
        obj.sections.section_total+=1;
        console.log(obj)
        /**结束**/
        fitDB.indexedDB.updatefit(id,obj,function(newobj){
          that.showModal.choiceseg = false;
          that.plan = newobj;
        })
      })
    },
    updatesec(event,secid,ob){//更新环节字段
      var that = this;
      console.log("111")
      that.edittitle=false;
      var id = localStorage.getItem("currenttpid");
      fitDB.indexedDB.getfitbyid(id,function(obj){//先获取训练计划，再更新循环
         /**
         * 主要方法
         */
        for(var i=0;i<obj.sections.length;i++){
          if(secid == obj.sections[i].secid){
            for(var o in ob){
              if(o.indexOf("action.")>-1){
                obj.sections[i].action[o.split("action.")[1]] = ob[o];
              }else if(o.indexOf("pattern.")>-1){
                obj.sections[i].pattern[o.split("pattern.")[1]] = ob[o];
              }else if(o.indexOf("replaceAction.")>-1){
                obj.sections[i].replaceAction[o.split("replaceAction.")[1]] = ob[o];
              }else if(o.indexOf("score.")>-1){
                obj.sections[i].score[o.split("score.")[1]] = ob[o];
              }else{
                obj.sections[i][o] = ob[o];
              }
              
            }
            break;
          }
        }
        /**结束**/
        fitDB.indexedDB.updatefit(id,obj,function(newobj){
          that.plan = newobj;
        })
      })
    },
    removeseg(secid){//删除环节
      var that = this;
      var id = localStorage.getItem("currenttpid");
      fitDB.indexedDB.getfitbyid(id,function(obj){//先获取训练计划，再更新循环
         /**
         * 主要方法
         */
        for(var i=0;i<obj.sections.length;i++){
          if(secid == obj.sections[i].secid){
            obj.sections.splice(i,1);
            obj.section_total-=1;
            break;
          }
        }
        /**结束**/
        fitDB.indexedDB.updatefit(id,obj,function(newobj){
          that.plan = newobj;
        })
      })
    },
    actiontype(type){//根据action.type的不同返回不同的类
      var types = {
        "movement":"movement",
        "rest":"rest",
        "intro":"intro"
      }
      return types[type];
    },
    addactiontoseg(event,secid){//增加动作 简单的增加名字
      var that = this;
      var id = localStorage.getItem("currenttpid");
      fitDB.indexedDB.getfitbyid(id,function(obj){//先获取训练计划，再更新循环
         /**
         * 主要方法
         */
        for(var i=0;i<obj.sections.length;i++){
          if(secid == obj.sections[i].secid){
            obj.sections[i].movements.push({
              "tmid":new Date().getTime(),
              "sortid":obj.sections[i].movements.length,
              "action":{
                "name":that.nacname,
                "type":"movement"
              },
              "replaceAction":{},
              "pattern":{}
            })
            obj.movement_total+=1;
            break;
          }
        }
        /**结束**/
        fitDB.indexedDB.updatefit(id,obj,function(newobj){
          that.showModal.addaction = false;
          that.showModal.updateaction = false;
          that.nacname = '';
          that.plan = newobj;
        })
      })
    },
    updateactions(){
      var that = this;
      var id = localStorage.getItem("currenttpid");
      var cid = that.editingsec;
      var aid = that.editingaction;
      var movement = {};//根绝actionparams来组织
      movement["action"] = {
        name:that.editingactionobj.action.name,
        reps:that.editingactionobj.action.reps,
        type:that.editingactionobj.action.type,
        spec:that.specs,
        score:that.score
      };
      movement["replaceAction"] = {
        name:that.editingactionobj.replaceAction.name,
        reps:that.editingactionobj.replaceAction.reps,
        type:"movement",
        spec:that.replspecs,
        score:that.replscore      
      }
      console.log(movement)

      fitDB.indexedDB.getfitbyid(id,function(obj){//先获取训练计划，再更新循环
         /**
         * 主要方法
         */
        for(var i=0;i<obj.sections.length;i++){
          if(cid == obj.sections[i].secid){
            for(var j =0;j<obj.sections[i].movements.length;j++){
              if(aid = obj.sections[i].movements[j].tmid){
                obj.sections[i].movements[j].action = movement["action"];
                obj.sections[i].movements[j].replaceAction = movement["replaceAction"];
                break;
              }
            }
          }
        }
        /**结束**/
        fitDB.indexedDB.updatefit(id,obj,function(newobj){
          that.showModal.addaction = false;
          that.nacname = '';
          that.plan = newobj;
        })
      })
    },
    activeseg(obj){
      console.log(obj)
      this.selectedseg = obj.el.header;
    },
    seteditaction(tmid,secid){
      var that = this;
      that.editingaction = tmid;
      that.editingsec = secid;
      that.showModal.updateaction = true;

      var id = localStorage.getItem("currenttpid");
      var cid = that.editingsec;
      var aid = that.editingaction;


      fitDB.indexedDB.getfitbyid(id,function(obj){//先获取训练计划，再更新循环
         /**
         * 主要方法
         */
        for(var i=0;i<obj.sections.length;i++){
          if(cid == obj.sections[i].secid){
            for(var j =0;j<obj.sections[i].movements.length;j++){
              if(aid = obj.sections[i].movements[j].tmid){
                that.editingactionobj = obj.sections[i].movements[j];
                console.log(that.editingactionobj)
                if(!that.editingactionobj.action){
                  that.editingactionobj.action = {};
                }else{
                  if(that.editingactionobj.action.specs&&that.editingactionobj.action.specs.length>0){
                    that.specs = that.editingactionobj.action.specs;
                  }
                }
                if(!that.editingactionobj.replaceAction){
                  that.editingactionobj.replaceAction = {};
                }else{
                  if(that.editingactionobj.replaceAction.specs&&that.editingactionobj.replaceAction.specs.length>0){
                    that.replspecs = that.editingactionobj.replaceAction.specs;
                  }
                }
                break;
              }
            }
          }
        }
      })
    },
    addspec(){
      console.log("111")
      var that = this;
      var obj = that.sex?{
        name:"L"+that.specs.length,
        male:{
          lb:0,
          in:0
        },
        female:{
          lb:0,
          in:0
        }
      }:{
        name:"L"+that.specs.length,
        man:{
          lb:0,
          in:0
        }
      };
      console.log(that)
      console.log(obj)
      that.specs.push(obj)
    },
    addrepl(){
      var that = this;
      var obj = that.replsex?{
        name:"L"+that.replspecs.length,
        man:{
          lb:0,
          in:0
        }
      }:{
        name:"L"+that.replspecs.length,
        male:{
          lb:0,
          in:0
        },
        female:{
          lb:0,
          in:0
        }
      }
      that.replspecs.push(obj)
    },
    dupspec(i){
      var that = this;
      that.specs.splice(i,1);
    },
    duprepl(i){
      var that = this;
      that.replspecs.splice(i,1);      
    },
  }
}
</script>
