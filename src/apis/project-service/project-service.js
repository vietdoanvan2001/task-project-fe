import axios from "../base/base-service";
import {endPoint} from '@/apis/end-point.js';

//Get API

/**
 * Hàm call api lấy toàn bộ danh sách nhân viên
 * @returns danh sách nhân viên
 */
export async function getAllProject(){
    const endpoint = endPoint.PROJECT;
    return await axios.getAxios(endpoint);
}

export async function getProjectByID(id) {
    const endpoint = endPoint.PROJECT+"/"+id
    return await axios.getAxios(endpoint)
}

export async function getProjectByUserID(id){
    const endpoint = endPoint.PROJECT_GETBYUSERID+"/"+id
    return await axios.getAxios(endpoint)
}

//Post API

/**
 * Hàm call API thêm mới thông tin dự án
 * @param {employee} body 
 * @returns 
 */
 export async function addNewProject(body){
    const endpoint = endPoint.PROJECT;
    return await axios.postAxios(endpoint,body)
}

//PUT API
export async function updateProject(id,body){
    const endpoint = endPoint.PROJECT_UPDATE+"/"+id;
    return await axios.putAxios(endpoint,body)
}

//DELETE API
export async function deleteProjectByID(id){
    const endpoint = endPoint.PROJECT_DELETEBYID+"/"+id;
    return await axios.deleteAxios(endpoint)
}