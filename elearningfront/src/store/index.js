import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const ADD_ITEMNUM = 'ADD_ITEMNUM'
const REMBER_ANSWER = 'REMBER_ANSWER'
const INITIALIZE_DATA = 'INITIALIZE_DATA'
const COMPUTED_SCORE = 'COMPUTED_SCORE'
export default new Vuex.Store({
    state: {
        itemNum: 1, // 第几题
        result: [], // 这个数组用来记录选项结果
        totleScore: 0,
        rightResult:[],
        problems:[
        {}
        ]
    },
    mutations: {
        //点击进入下一题
        [ADD_ITEMNUM](state) {
            state.itemNum ++;
        },
        //记录答案
        [REMBER_ANSWER](state, id) {
            state.result.push(id);

        },
        
        // 初始化信息
        [INITIALIZE_DATA](state) {
            state.itemNum = 1;
            state.result = [];
            state.totleScore = 0;
            state.rightResult = [];
        },
        [COMPUTED_SCORE](state) {
            state.result.forEach((item, index) => {
                
                if(item.sort().toString() == state.rightResult[index].sort().toString())
                {
                    state.totleScore += 1
                }
               
            })

        }
    },
    actions: {
        addNum({ commit, state }, id) {
            //点击下一题，记录答案id，判断是否是最后一题，如果不是则跳转下一题
            commit('REMBER_ANSWER', id);
            if (state.itemNum < state.problems.length) {
                commit('ADD_ITEMNUM');
            }
        },
        //初始化信息
        initializeData({ commit }) {
            commit('INITIALIZE_DATA');
        },
        // 计算总分
        countScore({ commit }) {
            commit('COMPUTED_SCORE');
        }
    }
})

