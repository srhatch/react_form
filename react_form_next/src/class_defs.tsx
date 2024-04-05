import { InputValues, ErrorObject } from './interfaces';
export class RegisterModel implements InputValues {
    [index: string]: any;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    place: string;
    state: string;
    ageRange: string;
    accountType: string;
    dob: string;
    errorObj: ErrorObject;
    constructor(inputObj: InputValues) {
        this.username = inputObj.username;
        this.email = inputObj.email;
        this.password = inputObj.password;
        this.passwordConfirm = inputObj.passwordConfirm;
        this.place = inputObj.place;
        this.state = inputObj.state;
        this.ageRange = inputObj.ageRange;
        this.accountType = inputObj.accountType;
        this.dob = inputObj.dob;
        this.errorObj = {};
    }

    static checkMissingErrors(errorObj: ErrorObject) {
        // Checks for any missing input to display prompt to user
        for (let error in errorObj) {
            if(error.endsWith('Missing')) {
                return true;
            } else {
                return false;
            }
        }
    }
    checkMissing() {
        for (let prop in this) {
            if (!this[prop]) this.errorObj[`${prop}Missing`] = true;
        }
    }
    checkUsernameFormat() {
        if (this.username.endsWith('.com')) this.errorObj.usernameFormatError = true;
    }
    checkEmailFormat() {
        // checks that an @ sign exists followed by at least one character
        // followed by only 1 . (literal), followed by at least two characters (top level domain)
        if (this.email) {
            const emailRegex = /(.+)(@)(.+)(\.{1})(.{2,})$/;
            const isValid = emailRegex.test(this.email);
            if (!isValid) this.errorObj.emailFormatError = true;
        }
    }
    checkPasswordMatch() {
        if (this.password !== this.passwordConfirm) this.errorObj.passwordMatchError = true;
    }
    checkPasswordLength() {
        if (this.password.length < 8) this.errorObj.passwordLengthError = true;
    }
    checkDropdownInput(fullList: string[]) {
        if (!fullList.includes(this.state)) {
            this.errorObj.incorrectDropdownInput = true;
        }
    }
    checkErrors(dropdownInputList: string[]) {
        this.checkMissing();
        this.checkUsernameFormat();
        this.checkPasswordLength();
        this.checkPasswordMatch();
        this.checkEmailFormat();
        this.checkDropdownInput(dropdownInputList);
        if (Object.keys(this.errorObj).length > 0) {
            return true;
        } else {
            return false;
        }
    }
}