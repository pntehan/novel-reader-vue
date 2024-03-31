import { post } from "../utils/request";


export const userLogin = (query) => {
    return post('/api/userLogin', query)
}

export const userRegister = (query) => {
    return post('/api/userRegister', query)
}