import { post } from "../utils/request";


export const getBook = (query) => {
    return post('/api/getBook', query)
}
