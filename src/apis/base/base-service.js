import axios from "axios";

axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token')

const HTTP = axios.create({
    baseURL:'https://localhost:44304/api/v1/',
    headers: {"Content-Type": "application/json"}
  });

/**
 * Hàm base axios xử lí get request
 * @param {*} endpoint 
 * @param {*} query 
 * @returns 
 */  
export const getAxios = async(endpoint,query) => {
    return await HTTP.get(endpoint,{
        params: {
            ...query
        }
    })
}  

/**
 * Hàm base axios xử lí get request blob
 * @param {*} endpoint 
 * @param {*} query 
 * @returns 
 */
 export const getAxiosBlob = async (endpoint, query) => {
  return await HTTP.get(endpoint, {
    params: {
      ...query,
    },
    responseType: 'blob'
  });
};

/**
 * Hàm base axios xử lí post request
 * @param {*} endpoint 
 * @param {*} body 
 * @returns 
 */
export const postAxios = async(endpoint,body) => {
    return await HTTP.post(endpoint,{
        ...body
    })
} 
/**
 * Hàm base axios xử lí post blob request
 * @param {*} endpoint 
 * @param {*} body 
 * @returns 
 */
export const postAxiosBlob = async(endpoint,body) => {
    return await HTTP.post(
        endpoint,
        body,
        {responseType: "blob"}
    )
} 
/**
 * Hàm base axios xử lý put request
 * @param {*} endpoint 
 * @param {*} body 
 * @returns 
 */
export const putAxios = async(endpoint,body) => {
    return await HTTP.put(endpoint,{
        ...body
    })
} 

/**
 * Hàm base axios xử lý delete request 
 * @param {*} endpoint 
 * @param {*} query 
 * @returns 
 */
export const deleteAxios = async(endpoint,query) => {
    return await HTTP.delete(endpoint,{
        params: {
            ...query
        }
    })
} 

/**
 * Hàm base axios xử lý Multipledelete request 
 * @param {*} endpoint 
 * @param {*} query 
 * @returns 
 */
export const multipleDeleteAxios = async(endpoint,query) => {
    return await HTTP.delete(
        endpoint,{
            params: {
                ...query
            }
        }
      );
} 

export default {
    postAxiosBlob, getAxios, postAxios, putAxios, deleteAxios, multipleDeleteAxios,getAxiosBlob}