<template>
<el-collapse-transition>
    <div class="routeview">
    <div>
        <div style="float:left;">
            <h1>{{courseName}}</h1>
        </div>
        <div style="float:right;width:300px; margin-top:20px">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="Math.ceil((active+1)/pageDetail.length*100)"></el-progress>
        </div>
    </div>
    

    <!-- <el-steps :active="active" finish-status="success" align-center v-loading="loading" >
      <el-step v-for="(item, index) in pageDetail" :key="index" :title=item.coursePageName></el-step>
    </el-steps> -->
    <div>
        <div style="height: 50px"></div>

        <!-- <div v-for="(item, index) in pageDetail" :key="index" v-show="index == active" class="box">      
                <el-card class="box-card" v-html="item.htmlCode" v-loading="loading" >
                </el-card>
        </div>  -->
        
        <el-card class="box-card" v-html="pageDetail[active].htmlCode" v-loading="loading" v-if="active != -1">
        </el-card>
        
        <div style="margin-left:40%">
        <el-button style="margin-top: 12px;" round @click="pre" v-show="active != -1 && active != 0">Back</el-button>
        <el-button style="margin-top: 12px;" type="primary" round @click="next" v-show="!durationbtnShow && active != -1 && active != (pageDetail.length-1)">Next</el-button>
        <el-button style="margin-top: 12px;" type="primary" round @click="question" v-show="!durationbtnShow && active != -1 && active == (pageDetail.length-1) && questionGroupId!=-1">Quiz</el-button>
        <el-button style="margin-top: 12px;" type="primary" round @click="complete" v-show="!durationbtnShow && active != -1 && active == (pageDetail.length-1) && questionGroupId==-1">Complete</el-button>
        <el-button style="margin-top: 12px;" round v-show="durationbtnShow">{{durationNum == '' ? durationText : durationNum + ' second'}}</el-button>
        </div>
        <div style="height:5px"></div>
    </div>
    <div id="app_script" style="display: none;"></div>

    <div>
      <el-dialog
        title="Tips"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :show-close="false">
        <span>Whether to enter the quiz directly?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="readTraining">Retraining</el-button>
            <el-button type="primary" @click="skipTraining">Quiz</el-button>
        </span>
        </el-dialog>
    </div>
  </div> 

</el-collapse-transition>
</template>
<style scoped>
  @import "../../assets/css/layui.css";
</style>
<style>

.routeview {
  margin: 0 auto;

  padding-top: 70px;
}

body{
    padding: 18px;
}

.box {
    /* -webkit-display: flex;
    display: flex; */
    justify-content: center;

}

.box-card {
  width: 96%;
  padding: 18px;
}
</style>
<script>
export default {
    data(){
        return {
            courseId: 0,
            questionGroupId:0,
            courseName: '',
            duration:'',
            pageDetail:[{}],
            active: -1,
            loading: true,
            durationbtnShow: false,
            durationText:'start countdown...',
            durationNum: '',
            lock:'',
            passScore:0,
            id:0,
            questionNumber:0,
            dialogVisible: false,
            markedAsRead: 'N',
            forceRead: 'N'
        };
    },
    created() {
        
        if(this.$route.params.courseId == undefined)
        {
            this.$message.error("Disable page refresh");
            this.loading = false;
            retrun;
        }

        this.courseId = this.$route.params.courseId
        this.questionGroupId = this.$route.params.questionGroupId
        this.passScore = this.$route.params.passScore
        this.id = this.$route.params.id
        this.questionNumber = this.$route.params.questionNumber
        this.markedAsRead = this.$route.params.markedAsRead
        this.forceRead = this.$route.params.forceRead
  

        if(this.forceRead == 'Y')
        {
            this.loadCourseDetail()
        }
        else
        {
            if(this.markedAsRead == 'Y' && this.passScore != undefined)
            {
                this.dialogVisible = true;
            }
            else
            {
                this.loadCourseDetail()
            }
        }

    },
    mounted() {
        window.Vue = this;
    },
    methods: {
        next() {
            this.active = this.active + 1;
            if (this.active > this.pageDetail.length) 
            {
                this.active = 0;
            }

            this.setscript()
            
            this.countdown()
        },
        pre(){
            this.active = this.active -1;
            if(this.active < 0)
            {
                this.active = 0;
            }

            this.setscript()

            this.countdown()
        },
        question(){
            document.getElementById("app_script").innerHTML=""
            this.loading = true;
            this.$axiosjwt({
                url: "/api/basic/updatetrainingmarkedasread",
                method: "post",
                data: {
                    id: this.id,
                },
                success: (result) => {
                        this.loading = false;
                        if (result.code != 200) {
                            this.$message.error("set marked as read error.");
                        } else {
                            this.$router.push({name:'Quiz', params : {id: this.id, courseId :this.courseId,questionGroupId :this.questionGroupId,questionNumber:this.questionNumber, passScore: this.passScore, markedAsRead: this.markedAsRead, forceRead: this.forceRead}});
                        }
                    },
                    error:(result)=>{
                        this.$message.error("System internal error, please contact the administrator");
                        this.loading = false;
                    }
                });
        },
        complete()
        {
            this.loading = true;

            this.$axiosjwt({
                url: "/api/basic/updatetrainingscore",
                method: "post",
                data: {
                    id: this.id,
                    score: -1
                },
                success: (result) => {
                        this.loading = false;
                        if (result.code != 200) {
                            this.$message.error("submit exception");
                        } else {
                            this.$router.push({ path:'/elearningmain'})
                        }
                    },
                    error:(result)=>{
                        this.$message.error("System internal error, please contact the administrator");
                        this.loading = false;
                    }
                });

            document.getElementById("app_script").innerHTML=""
        },
        countdown()
        {
            window.clearInterval(this.clock)
            this.durationNum = ''

            if(this.duration != 0)
            {
                var innerDuration = this.duration
                this.durationbtnShow = true

                this.clock = window.setInterval(() => {
                        this.durationNum = innerDuration--

                        if(innerDuration <0)
                        {
                            window.clearInterval(this.clock)
                            this.durationNum = ''
                            this.durationbtnShow = false
                        }

                },1000)
            }
            else{
                this.durationbtnShow = false;
            }
        },
        loadCourseDetail(){
            this.dialogVisible = false
          
            this.$axiosjwt({
            url: "/api/basic/coursedetail",
            method: "post",
            data: {
                courseId: this.courseId
            },
            success: (result) => {
                    this.active=0
                    this.loading = false;
                    if (result.code != 200) {
                        this.$message.error("Loading data error");
                    } else {
                        var course = result.data["coursedetail"];
                        this.courseName = course.courseName
                        this.duration = course.duration
                        var list = this.sortByOrderNumber(course.pageDetail)
                        this.pageDetail = list
                        
                   
                        this.countdown()

                        this.setscript()
                    }

                },
                error:(result)=>{
                    this.$message.error("System internal error, please contact the administrator");
                    this.loading = false;
                }
            });
        },
        skipTraining(){
            this.dialogVisible = false
            this.question()
        },
        readTraining(){
            this.loadCourseDetail()
        },
        sortByOrderNumber(list)
        {
            let newArray = list;
            newArray.sort((a,b)=>{return a.orderNumber-b.orderNumber})
            return newArray;
        },
        setscript()
        {
            this.$nextTick(() => {
                            document.getElementById("app_script").innerHTML=""
                            let htmlcontent = this.pageDetail[this.active].htmlCode
                            let scriptExp = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script\s*>/ig
                            let commentExp = /<!--.*?-->/ig
                            let match

                            htmlcontent = htmlcontent.replace(commentExp, ''); //remove comments
                                    
                            while(match = scriptExp.exec(htmlcontent)) {
                              let script = document.createElement('script')
                                script.type = 'text/javascript'
                                script.text = match[1]
                                document.getElementById('app_script').appendChild(script)
                            }
                        });

        }
    }
}
</script>