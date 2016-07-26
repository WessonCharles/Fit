<template>
  <div class="{{stack?'segtabs':''}}">
    <!-- Nav tabs -->
     <ul class="nav nav-{{navStyle}} {{stack?'nav-stacked':''}}" role="tablist">
            <li
                v-for="r in renderData"
                v-bind:class="{
                  'active': ($index === active),
                  'disabled': r.disabled
                }"
                @click.prevent="handleTabListClick($index, r)"
                :disabled="r.disabled"
            >
                <a href="#">  
                    <slot name="header"> 
                      {{{r.header}}}
                  </slot> 
                </a>
            </li>
     </ul>

     <!-- Tab panes -->
     <div class="tab-content" v-el:tab-content>
        <slot></slot>
     </div>
     <div class="clearfix"></div>
  </div>
</template>

<script>
  export default {
    props: {
      navStyle: {
        type: String,
        default: 'tabs'
      },
      effect: {
        type: String,
        default: 'fadein'
      },
      active: {
        type: Number,
        default: 0
      },
      stack:{
        type:Boolean,
        default:false
      },
      select:{
        type: Function,
        default() {}
      }
    },
    data() {
      return {
        renderData: []
      }
    },
    ready(){
      this.select({index:0,el:this.renderData[0]});
    },
    methods: {
        handleTabListClick(index, el) {
            this.select({index:index,el:el});
            if (!el.disabled) this.active = index;
        }
    }
  }
</script>

<style scoped>
  .nav-tabs {
    margin-bottom: 15px
  }
  .nav-stacked>li.active>a, .nav-stacked>li.active>a:focus, .nav-stacked>li.active>a:hover{
    color: #555;
    cursor: default;
    background-color: #fff;
    border: 1px solid #ddd;
    border-right-color: transparent;
  }
</style>