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
            if (!this[prop]) this.errorObj[`${prop}Missing`] = `${prop}Missing`;
        }
    }
    checkUsernameFormat() {
        if (this.username.endsWith('.com')) this.errorObj.usernameFormatError = 'usernameFormatError';
    }
    checkEmailFormat() {
        // checks that an @ sign exists followed by at least one character
        // followed by only 1 . (literal), followed by at least two characters (top level domain)
        if (this.email) {
            const emailRegex = /(.+)(@)(.+)(\.{1})(.{2,})$/;
            const isValid = emailRegex.test(this.email);
            if (!isValid) this.errorObj.emailFormatError = 'emailFormatError';
        }
    }
    checkPasswordMatch() {
        if (this.password !== this.passwordConfirm) this.errorObj.passwordMatchError = 'passwordMatchError';
    }
    checkPasswordLength() {
        if (this.password && this.password.length < 8) this.errorObj.passwordLengthError = 'passwordLengthError';
    }
    checkDropdownInput(fullList: string[]) {
        if (this.state && !fullList.includes(this.state)) {
            this.errorObj.incorrectDropdownInput = 'incorrectDropdownInput';
        }
    }
    checkDateLength() {
        // If date input is too short then it can't be valid
        if (this.dob && this.dob.length < 10) this.errorObj.dateLengthError = 'dateLengthError';
    }
    checkDateValid() {
        const inputDate = this.makeDateObject();
        const currentDate = new Date();
        if (currentDate < inputDate) this.errorObj.invalidDateError = 'invalidDateError';
    }
    checkErrors(dropdownInputList: string[]) {
        this.checkMissing();
        this.checkUsernameFormat();
        this.checkPasswordLength();
        this.checkPasswordMatch();
        this.checkEmailFormat();
        this.checkDropdownInput(dropdownInputList);
        this.checkDateLength();
        this.checkDateValid();
        if (Object.keys(this.errorObj).length > 0) {
            return true;
        } else {
            return false;
        }
    }

    makeDateObject() {
        // Utility: convert date input string to a Date object
        const splitString = this.dob.split('/');
        const reversedDateArray = splitString.reverse();
        const formattedDateString = reversedDateArray.join('-');
        const dateObj = new Date(formattedDateString);
        return dateObj;
    }
}