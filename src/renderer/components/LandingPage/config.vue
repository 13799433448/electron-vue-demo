<template>
    <div>
        <el-button type="primary" size="mini" @click="query">刷新</el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center"> </el-table-column>
            <el-table-column prop="name" label="属相" width="180" align="center"> </el-table-column>
            <el-table-column prop="date1" label="码表" width="180">
                <template slot-scope="{ row }">
                    <el-input v-model="row.date1" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="date2" label="码表" width="180">
                <template slot-scope="{ row }">
                    <el-input v-model="row.date2" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="date3" label="码表" width="180">
                <template slot-scope="{ row }">
                    <el-input v-model="row.date3" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="date4" label="码表">
                <template slot-scope="{ row }">
                    <el-input v-model="row.date4" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="date5" label="码表">
                <template slot-scope="{ row }">
                    <el-input v-model="row.date5" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button type="text" size="small" @click="updated(row)"> 保存 </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          tableData: [],
        };
      },
      mounted() {
        this.query();
      },
      methods: {
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
        updated(row) {
          const { _id, ...obj } = row;
          this.$db.keywords.update({ _id }, { $set: obj }, (err) => {
            if (!err) {
              this.$message({
                message: '更新成功',
                type: 'success',
              });
            }
          });
        },
      },
    };
</script>
