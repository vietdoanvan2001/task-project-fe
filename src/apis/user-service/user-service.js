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

export async function getUserById(id){
    const endpoint = endPoint.USERS_GETBYID+"/"+id
    return await axios.getAxios(endpoint)
}

//Put API


//Post API

/**
 * Lấy thành viên theo filter
 * @param {*} body 
 * @returns 
 */
export async function getFilterUser(body){
    const endpoint = endPoint.USERS_FILTER;
    return await axios.postAxios(endpoint,body);
}

export async function getUsersByListID(listID){
    let IDs = "(";
    for(let i = 0; i< listID.length;i++){
        if(i<listID.length-1){
            IDs = IDs + "'" + listID[i] + "',"
        }
        else{
            IDs = IDs + "'" + listID[i] + "')"
        }
    }
    const param = {listID:IDs}
    const endpoint = endPoint.USERS_GETBYLISTID
    return await axios.postAxios(endpoint,param)
}

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
