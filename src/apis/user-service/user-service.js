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

export async function getListUsersInTrash(){
    const endpoint = endPoint.USERS_GETINTRASH;
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

export async function updateStatusByListID(listID, status){
    let IDs = "(";
    for(let i = 0; i< listID.length;i++){
        if(i<listID.length-1){
            IDs = IDs + "'" + listID[i] + "',"
        }
        else{
            IDs = IDs + "'" + listID[i] + "')"
        }
    }
    const param = {
        listID:IDs,
        status: status
    }
    const endpoint = endPoint.USERS_UPDATESTATUS
    return await axios.postAxios(endpoint,param)
}

export async function deleteByListID(listID){
    let IDs = "(";
    for(let i = 0; i< listID.length;i++){
        if(i<listID.length-1){
            IDs = IDs + "'" + listID[i] + "',"
        }
        else{
            IDs = IDs + "'" + listID[i] + "')"
        }
    }
    const param = {
        listID:IDs
    }
    const endpoint = endPoint.USERS_MULTIPLEDELETE
    return await axios.postAxios(endpoint,param)
}

export async function addToTrash(listID,status){
    let IDs = "(";
    for(let i = 0; i< listID.length;i++){
        if(i<listID.length-1){
            IDs = IDs + "'" + listID[i] + "',"
        }
        else{
            IDs = IDs + "'" + listID[i] + "')"
        }
    }
    const param = {
        listID:IDs,
        status: status
    }
    const endpoint = endPoint.USERS_ADDTOTRASH
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

export async function updateUserPass(body){
    const endpoint = endPoint.USER_UPDATEPASS;
    return await axios.postAxios(endpoint,body)
}

export async function updateUserInfor(id,body) {
    const endpoint = endPoint.USERS+"/"+id;
    return await axios.putAxios(endpoint,body)
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
