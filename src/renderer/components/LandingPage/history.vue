<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-date-picker
        v-model="curTime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期"
        size="mini"
      >
      </el-date-picker>
      <el-button
        style="float: right; margin-left: 10px;"
        icon="el-icon-refresh"
        type="primary"
        size="mini"
        plain
        @click="query">
        刷新
        </el-button>
      <el-button
        style="float: right"
        icon="el-icon-search"
        type="primary"
        size="mini"
        @click="query">
        查询
        </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item
              :label="`第${index + 1}次押注：`"
              v-for="(item, index) in row.count"
              :key="index"
            >
              <span>{{ item }}</span
              >注
            </el-form-item>
            <el-form-item label="共：">
              <span>{{ row.total }}</span>注
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="key" label="码值" width="180"> </el-table-column>
      <el-table-column prop="total" label="下单总数"> </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      curTime: "",
      tableData: [],
    };
  },
  mounted() {
    this.getDate();
    this.query();
  },
  methods: {
    getDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      this.curTime = year + "-" + month + "-" + day;
    },
    query() {
      const params = this.curTime ? { date: this.curTime } : {}
      this.$db.history.find(params, (err, doc) => {
        if (err) {
          return;
        }
        this.tableData = doc.map((item) => {
          return {
            ...item,
            total: item.count.reduce((total, num) => {
              return total + num;
            }),
          };
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  margin-bottom: 15px;
}
</style>
