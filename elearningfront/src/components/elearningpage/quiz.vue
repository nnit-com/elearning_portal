<template>
    <div class="routeview">
        <div>
            <div style="float:left;width:200px;">
                <h1 class="animate__animated animate__bounce">Quiz</h1>
            </div>
            <div style="float:right;width:400px; margin-top:20px">
                <el-progress :text-inside="true" :stroke-width="26" :percentage="Math.ceil(itemNum/problems.length*100)"></el-progress>
            </div>
        </div>
        <div style="height:50px"></div>
        <div class="show">
        
        <header class="head">
            <h3 class="head-questiontips">Question{{ itemNum }} </h3>
        </header>
        <div class="content" v-loading="loading">
        
            <!-- 题目界面内容 -->
            <div class="content-topic">
                <div>({{problems[itemNum-1].questionType == 1? "Single choice":"Multiple choice"}})</div>
                <div class="content-topic-question" v-html="problems[itemNum-1].question ">
                    
                </div>
                <div class="content-topic-answer">
                    <ul>
                        <!-- 这边ABCD的显示由chooseType函数实现显示 -->
                        <li style="margin-bottom: 4px" v-for="(item, index) in problems[itemNum-1].answer" :key="index" @click="choosed(index)">
                            <span :class="{'beenchoosed':choosedId.indexOf(index) > -1}">{{ chooseType(index+1) }}. </span>
                            <span :class="{'beenchoosed':choosedId.indexOf(index) > -1}">{{ item.describe }}</span>
                        </li>
                    </ul>
                </div>
                <transition name="el-zoom-in-top">
                    <div v-show="!valid">                        
                            <el-alert :title="alertMsg" type="success" v-if="alertFlag" show-icon :closable="false"></el-alert>
                            <el-alert :title="alertMsg" type="error" effect="dark" v-else show-icon :closable="false"></el-alert>

                            <div v-for="(item, index) in problems[itemNum-1].answer" :key="index">
                                <div :class="(item.isRight == '1')? 'info':'warning'" v-if="item.explanation != ''">{{chooseType(index+1)+ '. ' + item.explanation}}</div>
                            </div>
                    </div>
                </transition>
                <div style="height:5px"></div>
                <div>
                <!-- 这边判定一下到最后一题的时候显示 -->
                <el-button type="primary" round @click="validChoose" v-if="valid">Submit</el-button>
                <el-button type="primary" round @click="submitChoose" v-if="itemNum < problems.length && !valid">Next</el-button>
                <el-button type="primary" round @click="submitAnswer" v-if="itemNum == problems.length && !valid">Complete</el-button>
            </div>
            <div style="height:5px"></div>
            </div>
            
        </div>
    </div>
    </div>
    
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: 'show',
    props: [
        'connectComponent'
    ],
    created() {
        var problems = [];
        var rightResult = [];

        if(this.$route.params.questionGroupId == undefined)
        {
            this.$message.error("Disable page refresh");
            this.loading = false;
            retrun;
        }

        this.$axiosjwt({
            url: "/api/basic/quizdetail",
            method: "post",
            data: {
                groupId: this.$route.params.questionGroupId,
                topNum: this.$route.params.questionNumber
            },
            success: (result) => {
                    
                    if (result.code != 200) {
                        this.$message.error("Loading data error");
                    } else {
                        
                        this.initializeData();

                        var questionlist = result.data["qAndAList"];

                        var questions = [];
                        
                        for(var i=0; i < questionlist.length; i++)
                        {
                            var answers = [];
                            var qObj = new Object();
                            var question = questionlist[i];
                            qObj.question = question.description;
                            qObj.questionType = question.answerType;

                            var result = [];
                            for(var j=0; j < questionlist[i].answers.length; j++)
                            {
                                var aObj = new Object();
                                aObj.describe = questionlist[i].answers[j].answerDescription;
                                aObj.explanation = questionlist[i].answers[j].explanation;
                                aObj.isRight = questionlist[i].answers[j].isRight;
                                answers.push(aObj);

                                if(questionlist[i].answers[j].isRight == "1")
                                {
                                    result.push(j);
                                }
                            }
                            
                            qObj.answer = answers;
                            questions.push(qObj);

                            this.$store.state.rightResult.push(result);
                            
                        }

                        this.$store.state.problems = questions;
                        this.loading = false;
                    }

                },
                error:(result)=>{
                   this.loading = false;
                }
            });

        
    },
    computed: mapState([
        'itemNum',
        'result',
        'problems',
        'rightResult',
        'totleScore'
    ]),
    data() {
        return {
            choosedId: [], // 用于存所选答案索引
            percentage:0,
            loading: true,
            valid:true,
            alertMsg:'',
            alertFlag: true,
        }
    },
    methods: {
        chooseType: type => {
            switch(type){
                case 1: return 'A';
                case 2: return 'B';
                case 3: return 'C';
                case 4: return 'D';
                case 5: return 'E';
                case 6: return 'F';
                case 7: return 'G';
            }
        },
        choosed(type) {
            // this.choosedId = type;

            if(this.valid)
            {
                let arrIndex = this.choosedId.indexOf(type);
                if(arrIndex > -1)
                {
                    this.choosedId.splice(arrIndex, 1);
                }
                else{
                    this.choosedId.push(type);
                }
            }
        },
        validChoose(){
            if(this.choosedId.length == 0) {
                this.$message.error('No answer has been selected');
                return;
            }
                
            //单选多选校验
            if(this.problems[this.itemNum-1].questionType == 1 && this.choosedId.length > 1)
            {
                this.$message.error('You can only choose one answer to a single choice question');
                return;
            }
            else if(this.problems[this.itemNum-1].questionType == 2 && this.choosedId.length == 1)
            {
                this.$message.error('Choose at least two or more answers to multiple-choice questions ');
                return;
            }

            var yourChoose = this.choosedId.sort().toString()
            var rightChoose = this.$store.state.rightResult[this.itemNum-1].sort().toString()

            if(yourChoose == rightChoose)
            {
                this.alertFlag = true;
                this.alertMsg = "Good job!";
            }
            else
            {
                this.alertFlag = false;
                this.alertMsg = "Sorry! The correct answer should be " + this.translateChoose(rightChoose);
            }

            this.valid = false;

        },
        submitChoose() {
            

            // 当点击下一题时我们提交当前所选答案值
            //保存答案, 题目索引加一，跳到下一题
                this.addNum(this.choosedId);
                this.choosedId = [];

                this.valid = true;
        },
        ...mapActions([
            'addNum', 'initializeData', 'countScore'
        ]),
        submitAnswer() {

                // 交卷按钮任然要保存最后一个题答案，并且路由到结算页面
                this.addNum(this.choosedId);
                this.choosedId = [];
                this.countScore();

                this.loading = true;
     
                this.$axiosjwt({
                    url: "/api/basic/updatetrainingscore",
                    method: "post",
                    data: {
                        id: this.$route.params.id,
                        score: Math.ceil (this.$store.state.totleScore / this.$store.state.itemNum * 100)
                    },
                    success: (result) => {
                            this.loading = false;
                            if (result.code != 200) {
                                this.$message.error("submit exception");
                            } else {

                                this.$router.push({name:'Score', params : {id: this.$route.params.id, score :this.$store.state.totleScore, total:this.$store.state.itemNum, passScore: this.$route.params.passScore, courseId :this.$route.params.courseId,questionGroupId :this.$route.params.questionGroupId, questionNumber:this.$route.params.questionNumber, markedAsRead: 'Y', forceRead: this.$route.params.forceRead}});

                            }
                        },
                        error:(result)=>{
                            this.$message.error("System internal error, please contact the administrator");
                            this.loading = false;
                        }
                    });

                
            
        },
        translateChoose(arr){
            if(arr.length == 1)
            {
                return this.chooseType(parseInt(arr)+1)
            }
            else
            {
                var str = ''
                arr.split(',').forEach((item, index) => {
                    str += this.chooseType(parseInt(item)+1) + ','
                })

                str = str.substring(0, str.lastIndexOf(','))
                return str;
            }
        },
    }
}
</script>
<style>
.routeview {
  margin: 0 auto;
  padding-top: 70px;
}

li {
    list-style-type:none;
    cursor: pointer;
}

.el-alert {
    height: 50px;
}

.el-alert__title {
    font-size: 24px !important;
}

    .show {
        position: relative;
    }
    .head {
        position: absolute;
        left: 120px;
        top: 60px;
        /* font-weight: 800; */
        font-weight: bold;
        line-height: 1.2;
        color: #212121;
        font-size: 1.5rem;
    }
    .content {
        position: absolute;
        left: 120px;
        top: 140px;
        /* font-weight: 400; */
        margin-bottom: 10px;
        font-size: 1.2rem;
    }
    
    .beenchoosed {
        
        color: white;
        background-color: #004B6E;
    }

    .warning {
    padding: 8px 16px;
    background-color: #fff6f7;
    border-radius: 4px;
    border-left: 5px solid #fe6c6f;
    margin: 20px 0;
}

.info {
    padding: 8px 16px;
    background-color: #f0f9eb;
    border-radius: 4px;
    border-left: 5px solid #67C23A;
    margin: 20px 0;
}
</style>