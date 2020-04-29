module.exports = class User {
    constructor(name, dob, mobileNumber, emailId, password) {
        this.id = Math.random().toString(36).slice(2);
        this.name = name;
        this.dob = dob.substring(8) + '-' + dob.substring(5, 7) + '-' + dob.substring(0, 4);
        this.mobileNumber = mobileNumber;
        this.emailId = emailId;
        this.password = password;
        this.terms = true;
        this.registeredOn = (new Date()).toString();
    }
}