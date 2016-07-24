<template>
    <div @click.stop=""  @touchstart.stop="" class="calendar" v-show="show" :style="{'left':x+'px','top':y+'px'}" transition="calendar" transition-mode="out-in">
        <div class="calendar-tools">
            <i class="fa fa-angle-left float left" @click="prev"  @touchstart="prev"></i>
            <i class="fa fa-angle-right float right" @click="next"  @touchstart="next"></i>
            <div class="text center">
                <input type="number" v-model="year" value="{{year}}" @change="render(year,month)" min="1970" max="2100" maxlength="4" number>
                 / 
                {{month+1}}
            </div>
        </div>
        <table cellpadding="5">
            <thead>
                <tr>
                    <td v-for="week in weeks" class="week">{{week}}</td>
                </tr>
             </thead>
             <tbody>
                <tr v-for="(k1,day) in days">
                    <td 
                    v-for="(k2,child) in day" 
                    :class="{'today':child.today,'disabled':child.disabled}"
                    @click="select(k1,k2,$event,year+'/'+child.month+'/'+child.day)" @touchstart="select(k1,k2,$event)" data-date="{{year}}/{{child.month}}/{{child.day}}">
                    {{child.day}}
                    <div class="td-segment" v-if="plans[year+child.month+(child.day<10?'0'+child.day:child.day)]">
                        <div class="td-inner-segment">
                            <p v-for="seg in plans[year+child.month+(child.day<10?'0'+child.day:child.day)]" class="segment {{randomClass()}}" data-tpid="{{seg.tpid}}">{{seg.name}}</p>
                        </div>
                    </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <modal title="请选择训练类型" iscancel="false" isok="true" :callback="createplan" ok-text="开始制定" effect="zoom" :show.sync="showModal.type">
        <div class="modal-body" slot="modal-body">
            <div style="height:80px;width:80px;line-height:80px;text-align:center;" @click="current_type='crossfit'">CrossFit</div>
        </div>
    </modal>    
</template>

<script>
import modal from '../components/Modal.vue'
import fitDB from '../utils/indexedDB.js'
import protot from '../utils/prototypes.js'


module.exports = {
    props: {
        show: {
            type: Boolean,
            twoWay: true,
            default:true   
        },
        type: {
            type: String,
            default:"date" 
        },
        value: {
            type: String,
            twoWay: true,
            default:""   
        },
        x: {
            type: Number,
            default:0 
        },
        y: {
            type: Number,
            default:0
        }, 
        begin: {
            type: String,
            default:""
        }, 
        end: {
            type: String,
            default:""
        },
        range: {
            type: Boolean,
            default:false
        },
        rangeBegin:{
            type: Array,
            default:Array
        },
        rangeEnd:{
            type: Array,
            default:Array
        },
        plans:{
        	type:Object,
        	default:Object
        }
    },
    data:function(){
        return {
            year:0,
            month:0,
            day:0,
            hour:0,
            minute:0,
            second:0,
            days:[],
            today:[],
            currentMonth:Number,
            sep:"/",
            weeks:['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            months:['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],

            //about modal
            showModal:{
                type:false,//训练类型
            },

            //about plans
            whichDay:'',
            current_type:''
        }
    },
    created:function(){
        var that=this;
        console.log(that)
        var now = new Date();
        if(that.value!=""){
            if(that.value.indexOf("-")!=-1)that.sep="-";
            if(that.value.indexOf(".")!=-1)that.sep=".";
 
            if(that.type=="date"){
                var split=that.value.split(that.sep);
                that.year = parseInt(split[0]);
                that.month =parseInt(split[1])-1;
                that.day = parseInt(split[2]);
            }else if(that.type=="datetime"){
                var split=that.value.split(" ");
                var splitDate=split[0].split(that.sep);
                that.year = parseInt(splitDate[0]);
                that.month =parseInt(splitDate[1])-1;
                that.day = parseInt(splitDate[2]);
                if(split.length>1){
                    var splitTime=split[1].split(":");
                    that.hour = splitTime[0];
                    that.minute = splitTime[1];
                    that.second = splitTime[2];
                }
            }
            if(that.range){
                var split=that.value.split(" ~ ");
                if(split.length>1){
                    var beginSplit=split[0].split(that.sep);
                    var endSplit=split[1].split(that.sep);
                    that.rangeBegin=[parseInt(beginSplit[0]),parseInt(beginSplit[1]-1),parseInt(beginSplit[2])];
                    that.rangeEnd=[parseInt(endSplit[0]),parseInt(endSplit[1]-1),parseInt(endSplit[2])];
                }
            }
        }else{
            that.year = now.getFullYear();
            that.month =now.getMonth();
            console.log(now.getMonth())
            that.day = now.getDate();
            that.hour = that.zero(now.getHours());
            that.minute = that.zero(now.getMinutes());
            that.second = that.zero(now.getSeconds());
            if(that.range){
                that.rangeBegin=Array;
                that.rangeEnd=Array;
            }
        }
        that.render(that.year,that.month);
    },
    watch:{
        year:function(val,old){
            console.log("new %s old %s time:%s",val,old,+new Date);
        }
    },
    methods:{
        //about modal
        showmodals:function(e,key,date){
            if(e.target.className.indexOf("seg-color")>-1){
                return false;
            }
            var that = this;
            if(e.target.className.indexOf("disabled")>-1){
                return false;
            }
            that.whichDay = date;
            this.showModal[key] = true;
        },
        //about calendar
        zero:function(n){
            return n<10?'0'+n:n;
        },
        render:function(y,m){
            var that=this;
            var firstDayOfMonth = new Date(y, m, 1).getDay();//当月第一天
            var lastDateOfMonth = new Date(y, m + 1, 0).getDate();//当月最后一天
            var lastDayOfLastMonth = new Date(y, m, 0).getDate();//最后一月的最后一天
            that.year=y;
            that.currentMonth=that.months[m];
            var seletSplit=that.value.split(" ")[0].split(that.sep);
            var i,line=0,temp=[];
            var prevmonth = 0,nextmonth = 0;
            if (that.month == 0) {
                prevmonth = 11;
            } else {
                prevmonth = parseInt(that.months[m]) - 1;
                prevmonth = prevmonth<10?'0'+prevmonth:prevmonth;
            }
            if (that.month == 11) {
                nextmonth = 0;
            } else {
                nextmonth = parseInt(that.months[m]) + 1 ;
                nextmonth = nextmonth<10?'0'+nextmonth:nextmonth;
            }
            for(i=1;i <= lastDateOfMonth;i++) {
                var dow = new Date(y, m, i).getDay();
                // 第一行
                if (dow == 0) {
                    temp[line]=[];
                }else if (i == 1) {
                    temp[line]=[];

                    var k = lastDayOfLastMonth - firstDayOfMonth + 1;
                    for (var j = 0; j < firstDayOfMonth; j++) {
                        temp[line].push({month:prevmonth,day:k,disabled:true});
                        k++;
                    }
                }
 
                // 如果是日期范围
                if(that.range){
                      
                    var options={day:i};
       
                    if(that.rangeBegin.length>0){
                        var beginTime=Number(new Date(that.rangeBegin[0],that.rangeBegin[1],that.rangeBegin[2]));
                        var endTime=Number(new Date(that.rangeEnd[0],that.rangeEnd[1],that.rangeEnd[2]));
                        var thisTime=Number(new Date(that.year,that.month,i));
 
                        if(beginTime<=thisTime&&endTime>=thisTime){
                            options.today=true;
                        }
                    }
                    temp[line].push(options);
                }else{
                   
                    var chk = new Date();
                    var chkY = chk.getFullYear();
                    var chkM = chk.getMonth();
                    if(
                        parseInt(seletSplit[0])==that.year 
                        &&
                        parseInt(seletSplit[1])-1==that.month
                        &&
                        parseInt(seletSplit[2])==i
                        &&
                        (that.begin==undefined||that.end==undefined)
                    ){
                        temp[line].push({day:i,today:true});
                        that.today=[line,temp[line].length-1];
                    // 当天
                    }else if (chkY == that.year && chkM == that.month && i == that.day&&that.value==undefined) {
                        temp[line].push({day:i,today:true});
                        that.today=[line,temp[line].length-1];
                    } else {//默认
                        var options={month:that.months[that.month],day:i,today:false};
                        if(that.begin){
                            var beginSplit=that.begin.split(that.sep);
                            var beginTime=Number(new Date(parseInt(beginSplit[0]),parseInt(beginSplit[1])-1,parseInt(beginSplit[2])));
                            var thisTime=Number(new Date(that.year,that.month,i));
                            if(beginTime>thisTime)options.disabled=true;
                        }
                        if(that.end){
                            var endSplit=that.end.split(that.sep);
                            var endTime=Number(new Date(parseInt(endSplit[0]),parseInt(endSplit[1])-1,parseInt(endSplit[2])));
                            var thisTime=Number(new Date(that.year,that.month,i));
                            if(endTime<thisTime)options.disabled=true;
                        }
                        if(!that.begin&&!that.end){
                            var thisTime=Number(new Date(that.year,that.month,i));
                            var nowtime = Number(new Date(that.year,that.month,that.day));
                            if(nowtime>thisTime)options.disabled=true;
                        }
                        temp[line].push(options);
                    }   
                }
               
                // 最后一行
                if (dow == 6) {
                    line++;
                }else if (i == lastDateOfMonth) {
                    var k = 1;
                    for (dow; dow < 6; dow++) {
                        temp[line].push({month:nextmonth,day:k,disabled:true});
                        k++;
                    }
                }
            }//end for
            that.days=temp;
            console.log(that.days)
        },
        prev:function(e){
            e.stopPropagation();
            var that=this;
            if (that.month == 0) {
                that.month = 11;
                that.year = that.year - 1;
            } else {
                that.month = that.month - 1;
            }
            that.render(that.year,that.month);
        },
        next:function(e){
            e.stopPropagation();
            var that=this;
            if (that.month == 11) {
                that.month = 0;
                that.year = that.year + 1;
            } else {
                that.month = that.month + 1;
            }
            that.render(that.year,that.month);
        },
        select:function(k1,k2,e,date){
            if(e!=undefined)e.stopPropagation();
            var that=this;
            // 日期范围
            if(that.range){
                if(that.rangeBegin.length==0||that.rangeEndTemp!=0){
                    that.rangeBegin=[that.year,that.month,that.days[k1][k2].day,that.hour,that.minute,that.second];
                    that.rangeBeginTemp=that.rangeBegin;
                    that.rangeEnd=[that.year,that.month,that.days[k1][k2].day,that.hour,that.minute,that.second];
                    that.rangeEndTemp=0;
                }else{
                    that.rangeEnd=[that.year,that.month,that.days[k1][k2].day,that.hour,that.minute,that.second];
                    that.rangeEndTemp=1;
                    // 判断结束日期小于开始日期则自动颠倒过来
                    if(+new Date(that.rangeEnd[0],that.rangeEnd[1],that.rangeEnd[2])<+new Date(that.rangeBegin[0],that.rangeBegin[1],that.rangeBegin[2])){
                        that.rangeBegin=that.rangeEnd;
                        that.rangeEnd=that.rangeBeginTemp;
                    }
                }
                that.render(that.year,that.month);
            }else{
                // 取消上次选中
                if(that.today.length>0){
                    that.days[that.today[0]][that.today[1]].today=false; 
                }
                 // 设置当前选中天
                that.days[k1][k2].today=true;
                that.day=that.days[k1][k2].day;
                that.today=[k1,k2];
                if(that.type=='date'){
                    that.value=that.year+that.sep+that.zero(that.month+1)+that.sep+that.zero(that.days[k1][k2].day);
                    // that.show=false;   
                }
            }
            that.showmodals(e,"type",date);

        },
        //about plans 
        randomClass:function(){
            var classlist = ['seg-color1','seg-color2','seg-color3','seg-color4','seg-color5','seg-color6'];
            return classlist[Math.round(Math.random()*5)];
        },
        createplan:function(){
            var that = this;
            console.log(that.whichDay);
            var data = {
                tpid:new Date().getTime(),
                type:that.current_type,
                name:new Date(that.whichDay.split("/")[0],parseInt(that.whichDay.split("/")[1]-1),that.whichDay.split("/")[2]).pattern("yyyyMMdd"),
                ref:new Date(that.whichDay.split("/")[0],parseInt(that.whichDay.split("/")[1]-1),that.whichDay.split("/")[2]).pattern("yyyyMMdd"),//以天为单位的时间戳键 用来在相应的日期显示
                sections:[],
                createAt:new Date()
            }
            fitDB.indexedDB.addfit(data,function(){
                fitDB.indexedDB.getallfit(function(datas){
                    var obj = {};
                    for(var d=0;d<datas.length;d++){
                        if(!obj[datas[d].ref])obj[datas[d].ref] = [];
                        obj[datas[d].ref].push(datas[d]);
                    }
                    localStorage.setItem("currenttpid",data.tpid);
                    that.showModal.type = false;
                    that.$parent.$set("plans",obj);
                    setTimeout(function(){
                        that.$router.go({name:"create"});
                    })
                })
            })
        },
    },
    components:{
        modal
    }
}
</script>
 
<style scope>
.calendartitle{
	font-size: 19px;
}
.calendar {
    position: relative;
    border-radius: 2px;
    opacity: .95;
    -webkit-transition: all .5s ease;
    transition: all .5s ease;
    top:13px!important;
}
 
.calendar-enter, .calendar-leave {
    opacity: 0;
    transform: translate3d(0,-10px, 0);
}

.calendar-tools {
    height: 25px;
    position: absolute;
    font-size: 20px;
    line-height: 25px;
    color: #5e7a88;
    right: 0;
    width: 200px;
    top: -50px;
}
.calendar .text {
    border-radius: 5px;
    height: 27px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #ccc;
    font-size: 14px;
    line-height: 25px;
}
.calendar-tools .float.left{
    float:left;
    border-radius: 5px 0 0 5px;
}
.calendar-tools .float.right{
    float:right;
    border-radius: 0 5px 5px 0;
}
.calendar-tools input{
    font-size: 14px;
    line-height: 25px;
    color: #5e7a88;
    width: 70px;
    text-align: center;
    border:none;
    background-color: transparent;
}
.calendar-tools>i {
	border:1px solid #ccc;
    padding: 0 16px;
    line-height: 25px;
    cursor: pointer;
    color: #707070;
    background-color: #e8ecef;
}
.calendar-tools>i:hover{
    color:#5e7a88;
}
.calendar table {
    clear: both;
    width: 100%;
    margin-bottom:10px;
    border-collapse: collapse;
    color: #47636f;
}
.calendar thead{
	background-color: #03202e;
	color: #fff;
}
.calendar thead td:first-child {
    border-radius: 5px 0 0 5px;
}
.calendar thead td:last-child {
    border-radius: 0 5px 5px 0;
}
.calendar tbody{
	border-radius: 5px;
}
.calendar tbody tr:first-child{
	border-radius: 5px 5px 0 0;
}
.calendar tbody tr:last-child{
	border-radius: 0 0 5px 5px;
}
.calendar tbody tr:first-child td:first-child{
	border-top-left-radius: 5px;
}
.calendar tbody tr:first-child td:last-child{
	border-top-right-radius: 5px;
}
.calendar tbody tr:last-child td:first-child{
	border-bottom-left-radius: 5px;
}
.calendar tbody tr:last-child td:last-child{
	border-bottom-right-radius: 5px;
}
.calendar td {
    margin:2px !important;
    padding:8px 0;
    width: 14.28571429%;
    text-align: center;
    vertical-align: middle;
    font-size:16px;
    line-height: 125%;
    cursor: pointer;
}
.calendar tbody td {
    height: 100px;
    background-color: #02212f;
    border: 1px solid #05464c;
    vertical-align: top;
    padding: 5px!important;
}

.calendar td:hover{
    background:#354b58;
}
.calendar td.week{
    pointer-events:none !important;
    cursor: default !important;    
}
.calendar td.disabled {
    /*color: #c0c0c0;*/
    cursor: not-allowed;
    background-color: rgba(0,0,0,0.7);
}
.calendar td.today {
    background-color: #5e7a88;
    color: #fff;
    font-size:16px;
}
.calendar thead td {
  text-transform: uppercase;
}
.calendar .timer{
    margin:10px 0;
    text-align: center;
}
.calendar .timer input{
    border-radius: 2px;
    padding:5px;
    font-size: 14px;
    line-height: 18px;
    color: #5e7a88;
    width: 50px;
    text-align: center;
    border:1px solid #efefef;
}
.calendar .timer input:focus{
    border:1px solid #5e7a88;
}
.calendar-button{
    text-align: center;
}

.calendar-button button{
    border:none;
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    min-width: 8em;
    vertical-align: baseline;
    background:#5e7a88;
    color:#fff;
    margin: 0 .25em 0 0;
    padding: .8em 2.5em;
    font-size: 1em;
    line-height: 1em;
    text-align: center;
    border-radius: .3em;
}
.calendar-button button.cancel{
    background:#efefef;
    color:#666;
}

</style>
