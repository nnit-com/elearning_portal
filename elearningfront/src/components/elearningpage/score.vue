<template>
   <div class="routeview">
        <div>
            <div style="float:left;width:200px;">
                <h1>Quiz result</h1>
            </div>
        </div>
        <div style="height:50px"></div>
        <div>
   
                <el-row>
  <el-col :sm="24" :lg="18">
    <el-result :icon="resultFlag" :title="msg" :subTitle="subMsg">
      <template slot="extra">
        <el-button type="primary" round @click="returnHome">Close</el-button>
        <el-button type="primary" round @click="returnCourse">Try again</el-button>
      </template>
    </el-result>
  </el-col>
  
  <!-- <el-col :sm="12" :lg="6">
    <el-result icon="error" title="错误提示" subTitle="请根据提示进行操作">
      <template slot="extra">
        <el-button type="primary" size="medium">返回</el-button>
      </template>
    </el-result>
  </el-col> -->
  
</el-row>

        </div>
    </div>
    
</template>
<style scoped>
  
    .routeview {
        margin: 0 auto;
        padding-top: 90px;
        }
</style>

<script>
    export default {
        data(){
            return{
                itemNum:0,
                score: 0,
                passScore: 0,
                msg:'',
                subMsg:'',
                resultFlag:''
            }
        },
        created() {
          if(this.$route.params.score == undefined)
          {
              this.$message.error("Disable page refresh");
              retrun;
          }

            this.itemNum=this.$route.params.total
            this.score= this.$route.params.score
            this.passScore= this.$route.params.passScore

            this.msg = "There are " + this.itemNum+ " questions in total. The answer to "+this.score+" questions is correct and the score is "+Math.ceil (this.score / this.itemNum * 100)
            this.subMsg = "(Reference: the passing score is " + this.passScore + ")"
            this.resultFlag = Math.ceil (this.score / this.itemNum * 100) >= this.passScore? 'success': 'error'
        },
        methods: {
            returnHome(){
                this.$router.push({ path:'/elearningmain'})
            },
            returnCourse(){
               this.$router.push({ name:'Course', params : {id: this.$route.params.id, courseId :this.$route.params.courseId, questionGroupId: this.$route.params.questionGroupId, questionNumber: this.$route.params.questionNumber, passScore: this.passScore, markedAsRead: this.$route.params.markedAsRead, forceRead: this.$route.params.forceRead}})     
            }
        }
    }
</script>