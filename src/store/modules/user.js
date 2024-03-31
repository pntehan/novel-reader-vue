

const state = {
    //用户token
    user_id: getUserId()
};

const mutations = {
    /* 设置token */
    SET_USER_ID(state, user_id){
        state.user_id = user_id
    },

    /* 退出登录 */
    SET_LOGIN_OUT(state, value){
        state.user_id = value;
    }
};

const actions = {
    /* 设置id */
    setUserId({commit},value){
        window.localStorage.setItem("user_id", value)
        commit("SET_USER_ID", value)
    },
    /* 退出登录 */
    // eslint-disable-next-line no-unused-vars
    setLoginOut({commit}, value){
        window.localStorage.setItem("user_id", "");
        commit("SET_LOGIN_OUT", "");
    }
};

const getters = {

};
function getUserId(){
    if (window.localStorage.getItem('user_id')) {
        return window.localStorage.getItem('user_id')
    }
    else {
        return 1000
    }
}
export default {
    state,
    mutations,
    actions,
    getters,
}