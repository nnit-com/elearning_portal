<template>
    <div class="panel">
            <div class="panel-title">
                <h2 v-text="panelTitle"></h2>
                <div class="fr">
                    <el-button @click.stop="on_refresh" type="primary" plain icon="el-icon-refresh">
                        Refresh
                    </el-button>
                </div>
            </div>
            <div class="panel-body">
                <!--列表-->
                <el-table :data="datalist" highlight-current-row v-loading="listLoading" :cell-style="cellStyle" :row-style="rowStyle" :header-cell-style="{'text-align':'left'}" >
                    <el-table-column prop="id" label="ID" v-if="false">
                    </el-table-column>
                    <el-table-column prop="trainingName" label="Training Name" min-width="200px">
                    </el-table-column>
                    <el-table-column prop="tstatus" label="Training Retired" :formatter="formatTStatus" min-width="90px">
                    </el-table-column>
                    <el-table-column prop="status" label="Status" :formatter="formatPersonalStatus">
                    </el-table-column>
                    <el-table-column prop="score" label="Score">
                    </el-table-column>
                    <el-table-column prop="passScore" label="Pass Score(>=)">
                    </el-table-column>
                    <el-table-column prop="createdDate" label="Created Date" :formatter="formatCreateDate">
                    </el-table-column>
                    <el-table-column prop="completeDate" label="Complete Date" :formatter="formatCompleteDate">
                    </el-table-column>
                    <el-table-column prop="dueDate" label="Due Date" :formatter="formatDueDate">
                    </el-table-column>
                    <el-table-column label="" width="150">
                        <template slot-scope="scope">
                            <el-button  type="primary" round icon="el-icon-edit"  @click="handleTraining(scope.$index, scope.row)" v-show="scope.row.tstatus == '1'">Enter</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">                   
                    <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.curPage" :page-size="listQuery.pageSize" layout="total, prev, pager, next, jumper" :total="total" class="fr">
                    </el-pagination>
                </el-col>
               
            </div>
        </div>
</template>
<style scoped>
.panel {
    
  margin: 0 auto;
  padding-top: 90px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  .panel-title {
    padding: 0 15px;
    color: #535351;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px dotted rgba(0, 0, 0, 0.2);
    .panel_title_select {
      display: inline-block;
      .el-input__inner {
        height: 28px;
      }
    }
  }
  .panel-body {
    padding: 15px;
    overflow: hidden;
    font-weight: normal;
    .bottom-toolbar {
      margin-top: 15px;
      padding: 15px 0;
    }
  }
}

.fr {
    float: right;
}


</style>
<script>
export default {
    data(){
        return {
            datalist: [],
            total: 0,
            panelTitle: "My Training",
            listQuery: {
                    curPage: 1,
                    pageSize: 10,
                },
            listLoading: false,
        }
    },
    methods:{
        on_refresh(){
                this.getDatas();
            },
        handleTraining: function (index, row) {
                if(row.status == '1'){

                    this.$axiosjwt({
                        url: "/api/basic/updatetrainingstatustoinprogress",
                        method: "post",
                        data: {
                            id: row.id
                        },
                        success: (result) => {
                                this.loading = false;
                                if (result.code != 200) {
                                    this.$message.error("submit exception");
                                } else {

                                    this.$router.push({ name:'Course', params : {id: row.id,courseId :row.courseId, questionGroupId: row.questionGroupId, questionNumber:row.questionNumber, passScore: row.passScore, markedAsRead: row.markedAsRead, forceRead: row.forceRead}})
                    
                                }
                            },
                            error:(result)=>{
                                this.$message.error("System internal error, please contact the administrator");
                                this.loading = false;
                            }
                        });

                }else{
                    this.$router.push({ name:'Course', params : {id: row.id,courseId :row.courseId, questionGroupId: row.questionGroupId, questionNumber:row.questionNumber, passScore: row.passScore, markedAsRead: row.markedAsRead, forceRead: row.forceRead}})
                }
                
                
                
            },
        formatCreateDate: function(row, column)
        {
            return row.createdDate != null ? row.createdDate.substr(0,10) : ''
        },
        formatCompleteDate: function(row, column)
        {
            return row.completeDate != null ? row.completeDate.substr(0,10) : ''
        },
        formatDueDate:function(row, column)
        {
            return row.dueDate != null ? row.dueDate.substr(0,10) : ''
        },
        formatTStatus:function(row, column)
        {
            return row.tstatus == "2" ? "invalid":""
        },
        formatPersonalStatus:function(row, column)
        {
            var statusDisplayname = "";
            switch (row.status) {
                case "0":
                    statusDisplayname = 'draft';
                    break;
                case "1":
                    statusDisplayname = 'invited';
                    break;
                case "3":
                    statusDisplayname = 'in progress';
                    break;
                case "4":
                    statusDisplayname = 'exam failed';
                    break;
                case "2":
                    statusDisplayname = 'completed';
                    break;
                default:
                    break;
            }

            return statusDisplayname;
        },
        rowStyle({ row, rowIndex})
        {
            if(row.dueDate != undefined && (row.status == "4" || row.completeDate == undefined))
            {
                if(new Date(row.dueDate.substr(0, 10)) < new Date())
                {
                    return {'color':'#EA1B29'}    
                }
            }
        },
        cellStyle({row, column, rowIndex, columnIndex})
        {
            if(columnIndex == 3 && row.score != undefined)
            {
                if(row.score < row.passScore)
                {
                    return 'color:#EA1B29;'
                }
                else
                {
                    return 'color:#0CB618;'
                }
            }
            
        },
      
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getDatas();
            },

            getDatas() {

                this.listLoading = true;
                this.$axiosjwt({
                    url: "/api/basic/mytraininglist",
                    method: "post",
                    data: {
                        initial: localStorage.getItem("initial"),
                        curPage: this.listQuery.curPage,
                        pageSize: this.listQuery.pageSize
                    },
                    success: (result) => {
                            
                            if (result.code != 200) {
                                this.$message.error("Loading data error");
                            } else {
                                this.total = result.data["total"];
                                this.datalist = result.data["mytrainingList"];
                                this.listLoading = false;

                            }

                        },
                        error:(result) =>
                        {
                            this.$message.error("System internal error, please contact the administrator");
                            this.listLoading = false;
                        }
                    });
                },
    },
    mounted() {
            this.getDatas();
        }
}
</script>
