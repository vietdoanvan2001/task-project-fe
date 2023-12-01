import axios from "../base/base-service";
import {endPoint} from '@/apis/end-point.js';

//Get API

/**
 * Hàm call api lấy toàn bộ danh sách nhân viên
 * @returns danh sách nhân viên
 */
export async function getKanbanByProjectID(param){
    const endpoint = endPoint.KANBAN_GETBYPROJECTID;
    return await axios.getAxios(endpoint,param);
}

export async function insertKanban(body){
    const endpoint = endPoint.KANBAN
    return await axios.postAxios(endpoint,body)
}

export async function deleteKanbanByIntID(id){
    const endpoint = endPoint.KANBAN_DELETEBYID+"/"+id
    return await axios.deleteAxios(endpoint)
}


//PUT ÂPI
export async function updateKanbanByID(id,body){
    const endpoint = endPoint.KANBAN_UPDATE+"/"+id;
    return await axios.putAxios(endpoint,body)
}

export async function updateKanbanSortOrder(param){
    const endpoint = endPoint.KANBAN_UPDATESORTORDER
    return await axios.putAxios(endpoint,param)
}
