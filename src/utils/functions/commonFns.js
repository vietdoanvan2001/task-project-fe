import { DateStatus } from "@/commons/contants/date-status";
import { getUserById } from "@/apis/user-service/user-service";
import { showToast } from "../toast-message/toastMessage";
import { responseStatus } from "@/commons/enums/api-response-status";
import i18n from "@/plugins/i18n";
var { t } = i18n.global;
/**
 * Check chuỗi rỗng hoặc null
 * @param {*} str 
 * @returns 
 */
export function isNullOrEmpty(str) {
    return !str || str.trim() === '';
}

/**
 * Check ký tự đặc biệt
 * @param {*} char 
 * @returns 
 */
export function isSpecialCharacter(char) {
    const pattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/=`]/;
    return pattern.test(char);
  }

  /**
   * Check ký tự thường
   * @param {*} char 
   * @returns 
   */
export function isNonSpecialCharacter(char) {
    // Biểu thức chính quy kiểm tra xem ký tự không phải là ký tự đặc biệt
    const pattern = /^[a-zA-Z0-9]+$/;
    return pattern.test(char);
  }

  /**
   * Check định dạng email
   * @param {*} email 
   * @returns 
   */
export function isEmailValid(email) {
  // Biểu thức chính quy để kiểm tra email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

/**
 * Check chuỗi chỉ chứa số
 * @param {*} inputString 
 * @returns 
 */
export function containsOnlyNumbers(inputString) {
  // Sử dụng biểu thức chính quy để kiểm tra
  const regex = /^[0-9]+$/;
  return regex.test(inputString);
}

/**
 * Lấy phần tử bất kỳ trong 1 mảng
 * @param {*} array 
 * @returns 
 */
export function getRandomFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Lấy màu ngẫu nhiên
 */
export function getRandomColor(){
  const color = ['purple','bluegray','orange','teal','indigo','pink','cyan','yellow','green','blue']
  const code = [300,400,500,600,700]
  const randomColor = Math.floor(Math.random() * color.length);
  const randomCode = Math.floor(Math.random() * code.length);
  return `var(--${color[randomColor]}-${code[randomCode]})`
}

/**
 * Lấy avatar
 */
export function getAvatar(user){
  const background = getRandomColor();
  if(user){
    const name = user.fullName?.toUpperCase().trim().split(" ")
    if(!name){
      return {
        Text: 'undefined',
        Background: background
      }
    }
    if(name.length > 1){
      return {
        Text: name[0][0]+name[name.length-1][0],
        Background: background
      }
    }
    return {
      Text: name[0][0],
      Background: background
    }

  }
}

export function getName(string){
  if(string && !isNullOrEmpty(string)){
    const name = string?.toUpperCase().trim().split(" ")
    if(!name){
      return 'undefined'
    }
    if(name.length > 1){
      return name[0][0]+name[name.length-1][0]
    }
    return name[0][0]
  }
  return 'undefined'
}

/**
 * Lấy giờ hiện tại
 * @returns 
 */
export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12) || 12; // Chuyển đổi giờ sang định dạng 12 giờ
  return `${formattedHours}:${minutes} ${ampm}`;
}

/**
 * định dạng ngày
 * @param {*} inputDate 
 * @returns 
 */
export function formatDate(inputDate) {
  const date = new Date(inputDate);
  
  const day = (date.getDate()).toString().padStart(2, '0');
  const month = (date.getMonth()).toString().padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

export async function getUserInfor(id){
  try {
    const res = await getUserById(id)
    if(res && res.status && res.data && res.status == responseStatus.Success){
      return res.data
    }
    else{
      showToast.error(t('Error'))
    }
  } catch (error) {
    console.log(error);
    showToast.error(t('Error'))
  }
}

/**
 * Xác định trạng thái ngày
 * @param {*} endDate 
 * @param {*} finishDate 
 * @returns 
 */
export function validateDate(endDate, finishDate){
  const today = formatDate(new Date());
  const end = formatDate(new Date(endDate));
  const finish = formatDate(new Date(finishDate));
  const oneDay = 24 * 60 * 60 * 1000;
  if(finishDate){
    // if(end < finish){
    //   return DateStatus.OutOfDate
    // }
    return DateStatus.Done
  }
  
  if(!endDate){
    return DateStatus.NoProblem;
  }
  const endArr = end.split("/")
  const todayArr = today.split("/")
  const differenceInDays = Math.floor((endArr[2]-todayArr[2])*365+(endArr[1]-todayArr[1])*30+(endArr[0]-todayArr[0]));
  if (differenceInDays < 0) {
    return DateStatus.OutOfDate;
  } else if (differenceInDays === 0) {
    return DateStatus.ToDay;
  } else if (differenceInDays <= 7) {
    return DateStatus.DueSoon;
  } else {
    return DateStatus.NoProblem;
  }
}

