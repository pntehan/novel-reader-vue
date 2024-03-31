import { createStore } from 'vuex'
import user from "./modules/user";
import mutations from './mutations'
import actions from './actions'

const state = {
  bar: false,
  font_panel: false,
  font_icon: false,
  bg_color: 1,
  bg_night: false,
  fz_size: 18,
  curChapter: 1,
  windowHeight: '',
  list_panel: false,
  curBookDetailId: 1,
  curBookContentId: 1,
}

const getters=  {
};

export default createStore({
  state,
  mutations,
  actions,
  getters,
  //模块化
  modules: {
    user,
  }
})
