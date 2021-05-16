<template>
  <div id="app" style="height: 100%; box-sizing: border-box; padding: 0 0 0">
    <!--    <NavBar class="oj-header"></NavBar>-->
    <Main class="oj-container"></Main>
    <Login></Login>
    <Register></Register>
    <!--    <EditProblemPanel>-->

    <!--    </EditProblemPanel>-->
    <EditProblemPanel></EditProblemPanel>
    <EditContestPanel></EditContestPanel>

  </div>
</template>

<script>
import Main from '@/components/Main'
// import NavBar from '@/components/NavBar'
import EventBus from "@/utils/EventBus"
import Login from '@/components/Login'
import Register from "@/components/Register";
import EditProblemPanel from "@/components/Edit/EditProblemPanel";
import EditContestPanel from "@/components/Edit/EditContestPanel";

export default {
  name: 'App',
  components: {
    EditContestPanel,
    EditProblemPanel,
    Main,
    Login,
    Register,
    // EditProblemPanel,
    // NavBar,
  },
  data() {
    return {
      asideShowed: true,
      unfoldButtonShowed: false,
    }
  },
  methods: {
    changeUnfoldGuideButtonVisible(visible) {
      this.unfoldButtonShowed = visible && !this.asideShowed
    },
    changeAsideVisible(visible) {
      this.asideShowed = visible
      EventBus.$emit('changeAsideShowed', visible)
    },
  },
  computed: {},
  created() {
    EventBus.$on('changeAsideShowed', visible => {
      this.asideShowed = visible
    })
  }
}
</script>

<style>

.oj-header {
  height: 60px;
  margin: -60px 0 0;
}

.oj-container {
  height: 100%;
  transition: margin-left .5s;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  min-width: 1260px;
}

.el-menu {
  border: 0;
}

body::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #ffffff;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #ccc;
}

</style>
