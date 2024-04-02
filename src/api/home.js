import { get, post } from "../utils/request";

export const getIndexData = () => {
    return get('/api/index')
}

export const getHomeList = (query) => {
    return post('/api/getHomeList', query)
}

export const getSearchList = (query) => {
    return post('/api/getSearchList', query)
}
