<template>
  <div>
    <Panel class="oj-aside"></Panel>
    <div class="oj-main" :style="{marginLeft: (asideShowed ? '240px' : '0')}">
<!--      <keep-alive>-->
        <router-view style="overflow-y: auto" :params="params"></router-view>
<!--      </keep-alive>-->
      <!--      <PageFooter v-if="this.$route.path.indexOf('/problem/') === -1"></PageFooter>-->

      <div class="oj-aside-in-recognize" @mouseenter="changeUnfoldGuideButtonVisible(true)"
           @mouseleave="changeUnfoldGuideButtonVisible(false)">
        <transition>
          <div class="oj-aside-guide oj-aside-unfold" v-show="unfoldButtonShowed" @click="changeAsideVisible(true)">
            <i class="el-icon-s-unfold"></i>
          </div>
        </transition>
      </div>
    </div>
  </div>

</template>

<script>
import Panel from "@/components/Panel";
import EventBus, {EventName} from "@/utils/EventBus";
// import PageFooter from "@/components/PageFooter";
export default {
  name: "Main",
  components: {
    Panel,
    // PageFooter
  }, data() {
    return {
      asideShowed: true,
      unfoldButtonShowed: false,
      params:{},
    }
  },
  methods: {
    changeUnfoldGuideButtonVisible: function (visible) {
      this.unfoldButtonShowed = visible && !this.asideShowed
    },
    changeAsideVisible: function (visible) {
      this.asideShowed = visible
      EventBus.$emit(EventName.ChangeAsideVisible, visible)
    },
  },
  created() {
    EventBus.$on(EventName.ChangeAsideVisible, visible => {
      this.asideShowed = visible
    })
  }
}
</script>

<style scoped>

.oj-aside {
  position: relative;
  height: 100%;
  width: 240px;
  float: left;
}

.oj-main {
  /*position: relative;*/
  margin-left: 240px;
  height: 100%;
  transition: margin-left .5s;
  overflow-y: scroll;
}

.oj-aside-in-recognize {
  top: 40%;
  width: 120px;
  height: 20%;
  position: absolute;
  /*top: 0;*/
}

</style>