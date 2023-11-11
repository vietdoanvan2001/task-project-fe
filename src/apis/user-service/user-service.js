import axios from "../base/base-service";
import {endPoint} from '@/apis/end-point.js';

//Get API

/**
 * Hàm call api lấy toàn bộ danh sách nhân viên
 * @returns danh sách nhân viên
 */
export async function getAllUsers(){
    const endpoint = endPoint.USERS;
    return await axios.getAxios(endpoint);
}

//Put API


//Post API

/**
 * Hàm call API thêm mới thông tin nhân viên
 * @param {employee} body 
 * @returns 
 */
 export async function addNewUser(body){
    const endpoint = endPoint.USERS;
    return await axios.postAxios(endpoint,body)
}

/**
 * Đăng nhập
 * @param {*} body 
 * @returns 
 */
export async function onLogin(body){
    const endpoint = endPoint.USERS_LOGIN;
    return await axios.postAxios(endpoint,body)
}


//Delete API
