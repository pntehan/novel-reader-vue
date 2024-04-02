import { get, post } from "../utils/request";


export const userLogin = (query) => {
    return post('/api/userLogin', query)
}

export const userRegister = (query) => {
    return post('/api/userRegister', query)
}

export const getUser = (query) => {
    return post('/api/getUser', query)
}

export const userUpdate = (query) => {
    return post('/api/userUpdate', query)
}

export const getCommentByUser = (query) => {
    return post('/api/getCommentByUser', query)
}

export const getInfoByUser = () => {
    return get('/api/getInfoByUser')
}