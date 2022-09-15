module.exports = {
    configureWebpack:{
        externals: {
           'vue': 'Vue',
           'vuex': 'Vuex',
           'vue-router':'VueRouter',
           'element-ui': 'ELEMENT'
        }
    },
    devServer:{
        port:80
    },
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/pc/'
}
