import axios from "../base/base-service";
import {endPoint} from '@/apis/end-point.js';

//Get API

/**
 * Hàm call api lấy toàn bộ danh sách nhân viên
 * @returns danh sách nhân viên
 */
export async function getAllTask(){
    const endpoint = endPoint.TASK;
    return await axios.getAxios(endpoint);
}

/**
 * Lấy danh sách công việc theo dự án
 */
export async function getTaskByProjectID(id){
    const endpoint = endPoint.TASK_GETBYPROJECTID+"/"+id
    return await axios.getAxios(endpoint);
}

export async function getTaskByID(id){
    const endpoint = endPoint.TASK+"/"+id
    return await axios.getAxios(endpoint)
}

//Post API

/**
 * Hàm call API thêm mới thông tin dự án
 * @param {employee} body 
 * @returns 
 */
 export async function addNewTask(body){
    const endpoint = endPoint.TASK;
    return await axios.postAxios(endpoint,body)
}

//Put api
export async function updateTask(id,body) {
    const endpoint = endPoint.TASK_UPDATE+"/"+id;
    return await axios.putAxios(endpoint,body)
}

export async function updateProcess(param){
    const endpoint = endPoint.TASK_UPDATEPROCESS
    return await axios.putAxios(endpoint,param)
}

export async function updateTaskKanban(param){
    const endpoint = endPoint.TASK_UPDATEKANBAN
    return await axios.putAxios(endpoint,param)
}
