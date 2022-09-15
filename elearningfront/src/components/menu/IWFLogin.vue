<template>
    <div class="back">
        <div style="width: 25%;position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);border-radius: 1px">
            <transition name="el-fade-in-linear">
                <el-card class="box-card" shadow="hover" style="text-align: center;"    @keyup.enter.native="login" >
                    <div slot="header" class="clearfix" style="text-align: center;">
                        <h2 style="font-size: 1rem;font-weight: bold">E-learning System</h2>
                    </div>
                    <el-input prefix-icon="el-icon-user-solid" v-model="input_user" placeholder="Please input username" class="inp"></el-input>
                    <div style="height: 1.3rem"></div>
                    <el-input prefix-icon="el-icon-lock" placeholder="Please input password" v-model="input_pwd" show-password class="inp" ></el-input>
                    <div style="height: 1.3rem"></div>
                    <!-- <div style="color:darkgray">(Please login with domain account)</div>
                    <div style="height: 1.3rem"></div> -->
                    <el-button type="primary" class="button" size="small" @click="login">Login</el-button>
                </el-card>
            </transition>
        </div>
    </div>
</template>

<script>
    import crypto from "crypto"

    export default {
        name:'Login',
        data() {
            return {
                input_user: '',
                input_pwd:'',
            }
        },
        methods:{
            /**
             * 登录
             * 用户名：username:this.input_user,
             * 密码：password:this.input_pwd,
             */
            login(){
                if (!this.input_user || !this.input_pwd){
                    this.open3("Username, password cannot be empty")
                    this.input_user=""
                    this.input_pwd=""
                }else{
                    //alert(this.basePath);
                    const rLoading = this.openLoading();
                    const pwd = $.md5(this.input_pwd)

                    this.$Axios({
                        url:'/api/logon/login',
                        method:'post',
                        data:{
                            code:this.input_user,
                            password:pwd
                            //password:crypto.createHash('md5').update(String(this.input_pwd)).digest('hex')
                        },
                        success:(result)=>{
                            
                            rLoading.close();
                            if (result.code!=200){
                                this.$message.error("Username or password input error")
                                this.input_pwd=""
                                // this.input_user=""
                            }else{
                                
                                localStorage.setItem("token",result.data.token)
                                localStorage.setItem("loginid",result.data.loginid)
                                localStorage.setItem("initial",result.data.initial)
                                
                                this.$router.push('/elearningmain')
                            }
                        },
                        error:(result)=>{
                            rLoading.close();
                            alert('Login failed, please contact the administrator')
                        }
                    })
                }
            },


            open3(v) {
                this.$message({
                    message:v,
                    type: 'warning'
                });
            },
        }
    }
</script>

<style scoped>

    .login{
    h3{
        text-align: center;
        height: 60px;
        line-height: 20px;
        border-bottom: 1px solid rgb(170, 170, 170);
        color: rgb(92, 92, 92);
    }
    .inp{
        margin-top: 10px;
    }
    .button{
        margin-top: 20px;
        position: fixed;left:50%;transform: translateX(-50%);
    }
    }

    .back {
        width: 100vw;
        height: 100vh;
        color: #fff;
        background: linear-gradient(-45deg,rgb(173,201,248), rgb(189,164,245), rgb(231,193,235), #23D5AB);
        background-size: 400% 400%;
        /* -webkit-animation: Gradient 15s ease infinite; */
        animation: Gradient 15s ease infinite;
    }

    @-webkit-keyframes Gradient{
        0%{
            background-position: 0% 50%;
        }
        50%{
            background-position: 100% 50%;
        }
        100%{
            background-position: 0% 50%;
        }
    }

    @keyframes Gradient{
        0%{
            background-position: 0% 50%;
        }
        50%{
            background-position: 100% 50%;
        }
        100%{
            background-position: 0% 50%;
        }
    }


    h2 {
        font-weight: 400;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        text-align: center;

    }

    .container {
        height: 100%;
        /* 设置渐变色 */
        background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);

    }
</style>