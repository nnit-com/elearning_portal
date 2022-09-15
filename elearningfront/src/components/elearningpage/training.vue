<template>
    <div class="routeview">
            <h2 class="text-title">
                My Assignments
                <span class="text-subtitle">
                    Training assignments to be completed.
                </span>
                </h2>
                <el-empty description="no data" v-if="emptyData"></el-empty>
            <div  v-for="(c,index) in myAssigne" :key="index">
            <el-card class="box-card" v-loading="loading">
                <div slot="header" class="clearfix">
                    <h2>{{c.trainingName}}</h2>
                    <el-button  type="primary" round icon="el-icon-edit"  @click="goto(c.courseId, c.questionGroupId, c.questionNumber, c.passScore, c.id, c.status, c.markedAsRead, c.forceRead)" style="float: right;">Enter</el-button>
                </div>
                <div>
                    <div class="trainingDetail">
                        <span class="trainingDetailTitle">Course Name: </span>{{ c.courseName }}
                    </div>
                    <div class="trainingDetail">
                        <span class="trainingDetailTitle">Course Type: </span>{{ c.courseType }}
                    </div>
                    <div class="trainingDetail">
                        <span class="trainingDetailTitle">Description: </span>{{ c.description }}
                    </div>
                    <div class="trainingDetail" v-if="c.createdDate">
                        <span class="trainingDetailTitle">CreateDate: </span>{{ c.createdDate.substr(0,10) }}
                    </div>
                    <div :class="(c.dueDate != undefined && new Date(c.dueDate) >= new Date()) ? 'trainingDetail': 'trainingDetailWarning'" v-if="c.dueDate">
                        <span class="trainingDetailTitle">DueDate: </span>{{ c.dueDate.substr(0,10) }}
                    </div>
                </div>
            </el-card>
            <div style="height:20px"></div>
            </div>
        </div>
</template>
<style scoped>
.trainingDetail
{
    margin: 2 auto;
    padding-bottom: 10px;
}

.trainingDetailWarning
{
    margin: 2 auto;
    padding-bottom: 10px;
    color: #EA1B29;
}

.trainingDetailTitle
{
    font-weight: bold;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%px;
}

.routeview {
  margin: 0 auto;
  padding-top: 90px;
}

.text-title {
  margin-top: 0;
  padding: 0;
}

.text-subtitle {
  margin-left: 0.6em;
  font-size: 0.8em;
  color: #757575;
}

@media screen and (max-width: 400px){
      .text-subtitle {
        margin-left: 0.6em;
        font-size: 0.8em;
        color: #757575;
        white-space: nowrap;
      }
  }
</style>
<script>
export default {
  data() {
    return {
      initial: this.$route.query.initial,
      loading: true,
      myAssigne: [{}],
      emptyData: false
    };
  },
  computed:{
      initialUpperCase:{
          get: function(){
              return this.initial.toUpperCase()
          }
      }
  },
  beforeCreate() {
    this.$axiosjwt({
      url: "/api/basic/myassignmenttraininglist",
      method: "post",
      data: {
        initial: localStorage.getItem("initial"),
      },
      success: (result) => {
        this.loading = false;
        if (result.code != 200) {
          this.$message.error("Loading data error");
        } else {
          var list = result.data["trainingList"];
          this.myAssigne = list;
          
          if(list.length == 0)
          {
            this.emptyData = true;
          }
        }
      },
      error:(result)=>{
        this.$message.error("System internal error, please contact the administrator");
          this.loading = false;
      }
    });
  },
  methods: {
    goto(courseId, questionGroupId, questionNumber, passScore, id, status, markedAsRead, forceRead) {
      
      if(status == '1'){

                    this.$axiosjwt({
                        url: "/api/basic/updatetrainingstatustoinprogress",
                        method: "post",
                        data: {
                            id: id
                        },
                        success: (result) => {
                                this.loading = false;
                                if (result.code != 200) {
                                    this.$message.error("submit exception");
                                } else {

                                    this.$router.push({ name:'Course', params : {id: id,courseId :courseId, questionGroupId: questionGroupId, questionNumber:questionNumber, passScore: passScore, markedAsRead: markedAsRead, forceRead: forceRead}})
                    
                                }
                            },
                            error:(result)=>{
                                this.$message.error("System internal error, please contact the administrator");
                                this.loading = false;
                            }
                        });

       }else{
            this.$router.push({ name:'Course', params : {id: id,courseId :courseId, questionGroupId: questionGroupId, questionNumber:questionNumber, passScore: passScore, markedAsRead: markedAsRead, forceRead: forceRead}})
       }



      
    },
  },
};
</script>