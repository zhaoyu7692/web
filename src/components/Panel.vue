<template>
  <aside class="oj-aside" :style="{marginLeft: (asideShowed ? '0' : '-240px')}"
         @mouseenter="changeFoldGuideButtonVisible(true)" @mouseleave="changeFoldGuideButtonVisible(false)">
    <transition name="aside">
      <div class="oj-aside-guide oj-aside-fold" v-show="foldButtonShowed" @click="changeAsideVisible(false)">
        <i class="el-icon-s-fold"></i>
      </div>
    </transition>
    <el-menu
        ref="menu"
        :default-active="currentTab"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @open="handleOpen"
        @close="handleClose"
        @select="selectIndex"
    >
      <el-menu-item index="/index">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu ref="submenu" index="/problems">
        <template slot="title">
          <i class="el-icon-menu" :style="problemTitleColor('/problems')"></i>
          <span slot="title" :style="problemTitleColor('/problems')">题目列表</span>
        </template>
        <ButtonPanel :content="problemIds"
                     :default-active="curPid"
                     :width="190"
                     :button-clicked="problemButtonClicked"
                     style="padding-left: 25px">
        </ButtonPanel>
      </el-submenu>
      <el-menu-item index="/problemStatus">
        <i class="el-icon-s-data"></i>
        <span slot="title">提交状态</span>
      </el-menu-item>
      <el-menu-item index="/contests">
        <i class="el-icon-document"></i>
        <span slot="title">比赛列表</span>
      </el-menu-item>
      <el-submenu v-show="contestVisible" ref="submenu" index="/contest">
        <template slot="title">
          <i class="el-icon-menu" :style="problemTitleColor('/contest')"></i>
          <span slot="title" :style="problemTitleColor('/contest')">{{ contest.title }}</span>
        </template>
        <ButtonPanel :content="contestProblemIds"
                     :default-active="curContestPid"
                     :width="190"
                     :button-clicked="contestButtonClicked"
                     style="padding-left: 25px">
        </ButtonPanel>
      </el-submenu>
      <el-menu-item v-show="contestVisible" index="/submitStatus">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ contest.title + '提交状态' }}</span>
      </el-menu-item>
      <el-menu-item v-show="contestVisible" index="/contestStatus">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ contest.title + '榜单' }}</span>
      </el-menu-item>
      <el-menu-item v-show="this.$store.getters.isAdmin" index="/problemManager">
        <i class="el-icon-menu"></i>
        <span>创建题目</span>
      </el-menu-item>
      <el-menu-item v-show="this.$store.getters.isAdmin" index="/contestManager">
        <i class="el-icon-menu"></i>
        <span>创建比赛</span>
      </el-menu-item>
      <el-menu-item index="/profile">
        <i class="el-icon-user-solid"></i>
        <span slot="title">{{ this.$store.state.user ? this.$store.state.user.username : '登录 / 注册' }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script>
import EventBus, {EventName} from "@/utils/EventBus";
import ButtonPanel from "@/components/ButtonPanel";

export default {
  name: "Panel",
  components: {
    ButtonPanel,
  },
  data() {
    return {
      curPid: -1,
      curContestPid: -1,
      tabNames: [
        '/index',
        '/problems',
        '/submitStatus',
        '/contests',
        '/contest',
        '/contestStatus',
        '/profile',
        '/problemManager',
        '/contestManager',
      ],
      problemIds: [],
      currentTab: '/index',
      problemsButtonWidth: 0,
      contestProblemIds: [],
      problemTabOpen: false,
      asideShowed: true,
      foldButtonShowed: false,
      contest: {},
      contestVisible: false,
    }
  },
  computed: {},
  methods: {
    contestButtonClicked(item) {
      console.log('/contest')
      this.curContestPid = item
      console.log('/contest/' + this.contest.cid + '/' + item)
      this.$router.push('/contest/' + this.contest.cid + '/' + item)
    },
    problemTitleColor(key) {
      return key === this.currentTab ? 'color: #ffd04b' : ''
    },
    problemButtonClicked(pid) {
      this.curPid = pid
      this.$router.push('/problem/' + pid)
    },
    changeFoldGuideButtonVisible(visible) {
      this.foldButtonShowed = visible && this.asideShowed
    },
    changeAsideVisible(visible) {
      this.asideShowed = visible
      EventBus.$emit(EventName.ChangeAsideVisible, visible)
    },
    selectIndex(key, keyPath) {
      console.log(key, keyPath)
      this.currentTab = key
      switch (this.currentTab) {
        case '/profile': {
          this.loginOrRegister()
          break
        }
        case '/submitStatus':
        case '/contestStatus': {
          this.$router.push(this.currentTab + '/' + this.contest.cid)
          break
        }
        default: {
          this.$router.push(this.currentTab)
        }
      }
    },
    handleOpen(key) {
      this.currentTab = key
      console.log('handleopen')
      if (this.currentTab === '/contest') {
        this.$router.push(this.currentTab + '/' + this.contest.cid)
      } else {
        this.$router.push(this.currentTab)
      }
    },
    handleClose(key) {
      this.handleOpen(key)
      console.log('handleclose')
      this.$refs.menu.open(key)
    },
    loginOrRegister() {
      console.log(111111)
      if (this.$store.state.user === null) {
        EventBus.$emit(EventName.ChangeLoginDialogVisible, true)
      } else {
        this.$http.post('/authCheck/', this.$store.state.user)
            .then(() => {
            })
            .catch(() => {
              EventBus.$emit(EventName.ChangeLoginDialogVisible, true)
            })
      }
    }
  },
  watch: {
    currentTab(old, news) {
      console.log("current", old, news)
    }
  },
  created() {
    EventBus.$on(EventName.ChangeAsideVisible, visible => {
      this.asideShowed = visible
    })
    EventBus.$on(EventName.UpdateProblemIds, data => {
      this.problemIds = data
      this.$refs.menu.open('/problems')
    })
    EventBus.$on(EventName.UpdateContest, contest => {
      console.log(contest)
      this.contestVisible = true
      this.contest = contest
      this.currentTab = '/contest'
      this.$router.push({path: '/contest/' + this.contest.cid, params: contest})
    })
    EventBus.$on(EventName.UpdateContestPIds, data => {
      this.contestProblemIds = data
      console.log('openContest')
      this.$refs.menu.open('/contest')
    })
    let path = this.$route.path
    path = path.link('/')
    for (let tabNamesKey of this.tabNames) {
      tabNamesKey = '/' + tabNamesKey + '/'
      if (path.indexOf(tabNamesKey) === 1) {
        this.currentTab = tabNamesKey
        break
      }
    }
  },

}
</script>

<style scoped>
@import "../css/common.css";

.oj-aside {
  background: rgb(84, 92, 100);
  transition: margin-left .5s;
}

.oj-aside-fold {
  right: 0;
}

</style>