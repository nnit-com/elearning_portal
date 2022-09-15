<template>
    <div class="panel">
            <div class="panel-title">
                <h2 v-text="panelTitle"></h2>
                <div class="fr">
                    <el-select v-model="selectedCourseType" multiple placeholder="choose course type" style="margin-right:5px">
                        <el-option
                        v-for="item in courseType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button @click.stop="on_refresh" type="primary" plain icon="el-icon-refresh">
                        Refresh
                    </el-button>
                </div>
            </div>
            <div class="panel-body">
                <!--列表-->
                <el-table :data="datalist" highlight-current-row v-loading="listLoading" :header-cell-style="{'text-align':'left'}">
                    <el-table-column prop="id" label="ID" v-if="false">
                    </el-table-column>
                    <el-table-column prop="trainingName" label="Training Name">
                    </el-table-column>
                    <el-table-column prop="courseName" label="Course Name">
                    </el-table-column>
                    <el-table-column prop="courseType" label="Course Type">
                    </el-table-column>
                    <el-table-column prop="createdDate" label="Created Date" :formatter="formatDate">
                    </el-table-column>
                    <el-table-column prop="tpId" label="RelationId" v-if="false">
                    </el-table-column>
                    <el-table-column label="" width="170">
                        <template slot-scope="scope">
                            <el-button type="primary" round icon="el-icon-circle-plus-outline" @click="handleAssign(scope.$index, scope.row)" v-show="typeof(scope.row.tpId) == 'undefined'">Assign To Me</el-button>
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
            panelTitle: "Public Training",
            listQuery: {
                    curPage: 1,
                    pageSize: 10,
                },
            listLoading: false,
            courseType:[],
            selectedCourseType:[],
        }
    },
    methods:{
        on_refresh(){
                this.getDatas();
            },
        handleAssign: function (index, row) {
                this.listLoading = true;
                this.$axiosjwt({
                    url: "/api/basic/assignpublictraining",
                    method: "post",
                    data: {
                        initial: localStorage.getItem("initial"),
                        trainingId: row.id
                        
                    },
                    success: (result) => {
                            
                            if (result.code != 200) {
                                this.$message.error("assign exception");
                            } else {
                               this.getDatas();
                            }

                        },
                        error:(result) =>
                        {
                            this.$message.error("System internal error, please contact the administrator");
                            this.listLoading = false;
                        }
                    });
            },
        formatDate: function(row, column)
        {
            return row.createdDate != null ? row.createdDate.substr(0,10) : ''
        },
      
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getDatas();
            },

            getDatas() {

                this.listLoading = true;
                this.$axiosjwt({
                    url: "/api/basic/publictraininglist",
                    method: "post",
                    data: {
                        initial: localStorage.getItem("initial"),
                        curPage: this.listQuery.curPage,
                        pageSize: this.listQuery.pageSize,
                        courseTypes: this.selectedCourseType,
                    },
                    success: (result) => {
                            
                            if (result.code != 200) {
                                this.$message.error("Loading data error");
                            } else {
                                this.courseType = [];
                                this.total = result.data["total"];
                                this.datalist = result.data["publictrainingList"];

                                var coursetypelist = result.data["coursetype"];
                                
                                if(coursetypelist.length >0)
                                {                                
                                    coursetypelist.forEach((item, index) => {
                                       this.courseType.push({"value":item, "label":item});
                                    })
                                }

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
