<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-date-picker v-model="curTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" size="mini">
            </el-date-picker>
            <el-button style="float: right; margin-left: 10px" icon="el-icon-refresh" type="primary" size="mini" plain @click="query">
                刷新
            </el-button>
            <el-button style="float: right" icon="el-icon-search" type="primary" size="mini" @click="query"> 查询 </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" border show-summary :summary-method="getSummaries">
            <el-table-column type="expand" width="80">
                <template slot-scope="{ row }">
                    <el-form label-position="left" class="demo-table-expand">
                        <el-form-item :label="`第${index + 1}次押注：`" v-for="(item, index) in row.count" :key="index">
                            <span> {{ item }} </span>注
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteItem(row,index)"></el-button>
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
            <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button type="danger" size="small" @click="deleteHistory(row)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
    export default {
      data() {
        return {
          curTime: '',
          tableData: [],
        };
      },
      mounted() {
        this.getDate();
        this.query();
      },
      methods: {
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
          const params = this.curTime ? { date: this.curTime } : {};
          this.$db.history.find(params, (err, doc) => {
            if (err) {
              return;
            }
            this.tableData = doc.map(item => ({
              ...item,
              total: this.getTotal(item.count),
            }));
          });
        },
        getTotal(count) {
          if (!count) {
            return '--';
          }
          if (count.length === 0) {
            return '--';
          }
          return count.reduce((total, num) => total + num);
        },
        getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '总价';
              return;
            }
            // 日期
            if (index === 1) {
              sums[index] = ' ';
              return;
            }
            // 码值
            if (index === 2) {
              sums[index] = ' ';
              return;
            }
            // 操作
            if (index === 4) {
              sums[index] = ' ';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => Number.isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!Number.isNaN(value)) {
                  return prev + curr;
                }
                return prev;
              }, 0);
              sums[index] += '注';
            } else {
              sums[index] = 'N/A';
            }
          });

          return sums;
        },
        // 删除某次的下注数据
        deleteItem(row, index) {
          this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            const { _id, count } = row;
            count.splice(index, 1);
            this.$db.history.update({ _id }, { $set: { count } }, (err) => {
              if (err) {
                this.$message({
                  message: '删除失败',
                  type: 'warning',
                });
                return;
              }
              this.query();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
        },
        deleteHistory(row) {
          const { _id } = row;
          this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.$db.history.remove({ _id }, {}, (err) => {
              if (err) {
                this.$message({
                  message: '删除失败',
                  type: 'warning',
                });
                return;
              }
              this.query();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
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
