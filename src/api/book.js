import { post } from "../utils/request";


export const getBook = (query) => {
    return post('/api/getBook', query)
}

export const getCategorybooks = (query) => {
    return post('/api/getCategorybooks', query)
}

export const getShelfbooks = (query) => {
    return post('/api/getShelfbooks', query)
}

export const addShelf = (query) => {
    return post('/api/addShelf', query)
}

export const getChapterList = (query) => {
    return post('/api/getChapterList', query)
}

export const getChapter = (query) => {
    return post('/api/getChapter', query)
}

export const downloadBook = (query) => {
    return post('/api/downloadBook', query)
}