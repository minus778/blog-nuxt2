export const state = () => ({
    //分类列表
    categoryList: [],
    //标签列表
    tagList: [],
    //网站信息
    blogMes: {}
})

export const mutations = {
    setCategoryList(state, list) {
        state.categoryList = list
    },
    setTagList(state, list) {
        state.tagList = list
    },
    setBlogMes(state, item) {
        state.blogMes = item
    }
}

export const actions = {
    //初始化仓库
    async nuxtServerInit({ commit }, { app }) {
        //获取分类列表
        let { data: categoryList } = await app.$getCategories()
        //获取标签列表
        let { data: tagList } = await app.$getTags()
        //获取网站底部备案信息
        let { data: blogMes } = await this.$getBlogMes()
        commit('setCategoryList', categoryList)
        commit('setTagList', tagList)
        commit('setBlogMes', blogMes)
    }
}

export const getters = {
    //返回名称
    getName(state) {
        return state.blogMes.name
    }

}