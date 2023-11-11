 class Users {
  constructor(fullname, email, phonenumber, password, prePassword, status) {
    this.FullName = fullname;
    this.Email = email;
    this.PhoneNumber = phonenumber;
    this.Password = password;
    this.Status = status;
    this.PrePassword = prePassword;
    this.FullNameErrorMsg;
    this.EmailErrorMsg;
    this.PhoneNumberErrorMsg;
    this.PasswordErrorMsg;
    this.PrePasswordErrorMsg;
  }
  }

  export default Users;