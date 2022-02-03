<template>
  <div>
    <el-tabs v-model="activeName">
    <el-tab-pane label="下单" name="first">
      <first />
    </el-tab-pane>
    <el-tab-pane label="下单记录" name="second">
      <second/>
    </el-tab-pane>
    <el-tab-pane label="码表配置" name="third">
      <third />
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import data from '../static/data';
import first from './LandingPage/place-an-order.vue';
import second from './LandingPage/history.vue';
import third from './LandingPage/config.vue';
export default {
  name: 'landing-page',
  components: {
    first,
    second,
    third,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.$db.keywords.find({}, (err, doc) => {
        if (err) {
          return;
        }
        if (!doc || !doc.length) {
          this.init();
        }
      });
    },
    init() {
      this.$db.keywords.insert(data, (err) => {
        if (err) {
          this.$message({
            message: '初始化失败',
            type: 'warning',
          });
        }
      });
    },
  },
};
</script>
