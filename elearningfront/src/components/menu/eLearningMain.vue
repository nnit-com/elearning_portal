<template>
<el-collapse-transition>
    <div>
        <header class="navbar-fixed-top">
            <el-col :span="4" class="logo-pic" style="text-align:center; margin-top:10px">   
                <img src="static/img/logo.jpg" alt="Company" >     
            </el-col>  
            <el-col :span="6" class="logo-font" style="margin-top:15px"> 
                <h2>E-learning System</h2>
            </el-col>
            <el-col :span="2" style="margin-top:20px; margin-right:20px; float:right">
              <el-dropdown trigger="hover">
							<el-avatar class="el-dropdown-link"><em> {{initialUpperCase}} </em></el-avatar>
							<el-dropdown-menu slot="dropdown">
								<router-link class='inlineBlock' to="/elearningmain" style="text-decoration:none; color: black;">
									<el-dropdown-item>
										Home
									</el-dropdown-item>
								</router-link>
								<router-link class='inlineBlock' to="/elearningmain/mytraininglist" style="text-decoration:none; color: black;">
									<el-dropdown-item>
										My Training
									</el-dropdown-item>
								</router-link>
                <router-link class='inlineBlock' to="/elearningmain/publictraininglist" style="text-decoration:none; color: black;">
									<el-dropdown-item>
										Public Training
									</el-dropdown-item>
								</router-link>
								<el-dropdown-item divided @click.native="logout">Logout</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
                
            </el-col>
            
        </header>
        <router-view style="width:95%"></router-view>
        
    </div>
</el-collapse-transition>
</template>
<script>
export default {
  data() {
    return {
      initial: localStorage.getItem("initial"),
    };
  },
  computed:{
      initialUpperCase:{
          get: function(){
              return this.initial.toUpperCase()
          }
      }
  },
  methods:{
    logout(){
      localStorage.removeItem("token")
      localStorage.removeItem("loginid")
      localStorage.removeItem("initial")
      this.$router.push('/Login')
    }
  }
};
</script>


<style scoped>
/* body {
  text-align: center;
} */

.el-dropdown-link {
    cursor: pointer;
  }

.navbar-fixed-top {
  display: block;
  position: fixed;
  left: 0px;
  top: 0px;
  -webkit-transition: margin-top 0.3s, visibility 0.3s, opacity 0.3s;
  transition: margin-top 0.3s, visibility 0.3s, opacity 0.3s;
  z-index: 99;

  height: 70px;
  width: 100%;
  background: #fff;

  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.11), 0 3px 10px rgba(0, 0, 0, 0.09);
}

@media screen and (max-width: 400px){
      .el-col-3{
        width: 160px;
      }

      .el-col-5{
        padding-top: 10px;
        width: 150px;
         font-size: 10px;
      }
  }
</style>