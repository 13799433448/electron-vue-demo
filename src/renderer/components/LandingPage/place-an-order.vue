<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <p>当前时间：{{ curTime }}</p>
      <el-button type="primary" size="mini" @click="refresh">刷新</el-button>
      <!-- <el-button type="primary" size="mini" @click="remove">删除</el-button>
      <el-button type="primary" size="mini" @click="removeHistory">
        删除历史记录
      </el-button> -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center"> </el-table-column>
        <el-table-column prop="name" label="属相" width="180" align="center">
        </el-table-column>
        <el-table-column prop="date1" label="码表" width="180" align="center">
          <template slot-scope="{ row }">
            <el-link
              icon="el-icon-plus"
              type="primary"
              @click="add(row.date1)"
              >{{ row.date1 }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="date2" label="码表" width="180" align="center">
          <template slot-scope="{ row }">
            <el-link
              icon="el-icon-plus"
              type="success"
              @click="add(row.date2)"
              >{{ row.date2 }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="date3" label="码表" width="180" align="center">
          <template slot-scope="{ row }">
            <el-link
              icon="el-icon-plus"
              type="warning"
              @click="add(row.date3)"
              >{{ row.date3 }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="date4" label="码表" width="180" align="center">
          <template slot-scope="{ row }">
            <el-link
              icon="el-icon-plus"
              type="danger"
              @click="add(row.date4)"
              >{{ row.date4 }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="date5" label="码表" align="center">
          <template slot-scope="{ row }">
            <el-link
              icon="el-icon-plus"
              type="info"
              v-if="row.date5"
              @click="add(row.date5)"
              >{{ row.date5 }}</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="6">
      <h2 class="head">已下注：</h2>
      <div class="btn-box">
        <el-tag
          v-for="(item, index) in datas"
          :key="index"
          closable
          type="success"
          class="btn-txt"
          size="small"
          @close="deleteItem(index)"
        >
          {{ item }}
        </el-tag>
      </div>
      <el-input-number
        v-model="num"
        label="描述文字"
        size="mini"
        :min="0"
        :precision="0"
      ></el-input-number>
      <el-button type="primary" size="mini" @click="placeAnOrder">
        下 注
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      datas: [], // 已经下单的数据
      num: 0,
      curTime: '',
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.getDate();
      this.query();
    },
    getDate() {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;
      this.curTime = `${year}-${month}-${day}`;
    },
    query() {
      this.$db.keywords
        .find({})
        .sort({ key: 1 })
        .exec((err, docs) => {
          if (err) {
            return;
          }
          this.tableData = docs;
        });
    },
    // remove() {
    //   this.$db.keywords.remove({}, { multi: true }, (err) => {
    //     if (err) {
    //     }
    //   });
    // },
    add(value) {
      const has = this.datas.includes(value);
      if (!has) {
        this.datas.push(value);
        return;
      }
      this.$message({
        message: '已经添加了该数值了',
        type: 'warning',
      });
    },
    // removeHistory() {
    //   this.$db.history.remove({}, { multi: true }, (err, numRemoved) => {});
    // },
    // 下单
    placeAnOrder() {
      this.datas.forEach((item) => {
        this.find(item);
      });
    },
    async find(key) {
      await this.$db.history.find(
        { date: this.curTime, key },
        (err, doc) => {
          if (err) {
            return;
          }
          if (doc.length > 0) {
            this.update(key);
          } else {
            this.insert(key);
          }
        },
      );
    },
    insert(key) {
      this.$db.history.insert(
        { date: this.curTime, key, count: [this.num] },
        (err) => {
          if (err) {
            return;
          }
          this.datas = [];
          this.num = 0;
        },
      );
    },
    update(key) {
      this.$db.history.update(
        { date: this.curTime, key },
        { $push: { count: this.num } },
        {},
        (err) => {
          if (err) {
            return;
          }
          this.datas = [];
          this.num = 0;
        },
      );
    },
    deleteItem(index) {
      this.datas.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.head {
  height: 20%;
}
.btn-box {
  height: 550px;
  overflow: hidden;
  margin: 20px 10px;
}
.btn-txt {
  margin: 10px;
}
</style>
