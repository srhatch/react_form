import { InputObject, ErrorObject } from '../../types/interfaces';
import { states } from '../../data/stateList';

export class RegisterModel {
    [index: string]: any;
    username: InputObject;
    email: InputObject;
    password: InputObject;
    passwordConfirm: InputObject;
    place: InputObject;
    state: InputObject;
    ageRange: InputObject;
    accountType: InputObject;
    dob: InputObject;
    constructor(inputObj: InputObject) {
        this.username = inputObj.username ?? {value: '', errors: []};
        this.email = inputObj.email ?? {value: '', errors: []};
        this.password = inputObj.password ?? {value: '', errors: []};
        this.passwordConfirm = inputObj.passwordConfirm ?? {value: '', errors: []};
        this.place = inputObj.place ?? {value: '', errors: []};
        this.state = inputObj.state ?? {value: '', errors: []};
        this.ageRange = inputObj.ageRange ?? {value: '', errors: []};
        this.accountType = inputObj.accountType ?? {value: '', errors: []};
        this.dob = inputObj.dob ?? {value: '', errors: []};
    }

    static checkError(errorArray: ErrorObject[]) {
        if (errorArray?.length > 0) {
            return errorArray[0]
        } else {
            return undefined;
        }
    }
    checkMissing() {
        for (let prop in this) {
            if (!this[prop]?.value) {
                this[prop].errors.push({errorFor: `${prop}Missing`});
            }
        }
    }
    checkUsernameFormat() {
        if (this.username?.value?.endsWith('.com')) {
            this.username.errors.push({
                errorFor: 'usernameFormatError',
                errorMsg: 'Username cannot end with ".com"'
            })
        };
    }
    checkEmailFormat() {
        // checks that an @ sign exists followed by at least one character
        // followed by only 1 . (literal), followed by at least two characters (top level domain)
        if (this.email?.value) {
            const emailRegex = /(.+)(@)(.+)(\.{1})(.{2,})$/;
            const isValid = emailRegex.test(this.email.value);
            if (!isValid) {
                this.email.errors.push({
                    errorFor: 'emailFormatError',
                    errorMsg: 'Email must be in correct format'
                });
            }
        }
    }
    checkPasswordMatch() {
        if (this.password?.value !== this.passwordConfirm?.value) {
            this.passwordConfirm.errors.push({
                errorFor: 'passwordMatchError',
                errorMsg: 'Passwords must match'
            });
        }
    }
    checkPasswordLength() {
        if (this.password?.value?.length < 8) {
            this.password.errors.push({
                errorFor: 'passwordLengthError',
                errorMsg: 'Password must be at least 8 characters'
            });
        }
    }
    checkDropdownInput(fullList: string[]) {
        if (this.state?.value && !fullList.includes(this.state?.value)) {
            this.state.errors.push({
                errorFor: 'incorrectDropdownInput',
                errorMsg: 'Please enter a valid state'
            });
        }
    }
    checkDateLength() {
        // If date input is too short then it can't be valid
        if (this.dob?.value?.length < 10) {
            this.dob.errors.push({
                errorFor: 'dateLengthError',
                errorMsg: 'Please enter valid date (MM/DD/YYYY)'
            });
        }
    }
    checkDateValid() {
        const inputDate = this.makeDateObject();
        const currentDate = new Date();
        if (currentDate < inputDate) {
            this.dob.errors.push({
                errorFor: 'invalidDateError',
                errorMsg: 'Date must be before today'
            });
        }
    }
    checkErrors() {
        this.checkMissing();
        this.checkUsernameFormat();
        this.checkPasswordLength();
        this.checkPasswordMatch();
        this.checkEmailFormat();
        this.checkDropdownInput(states);
        this.checkDateLength();
        this.checkDateValid();
        const errorArray = Object.values(this).map(value => value.errors.length > 0);
        if (errorArray.some(item => item === true)) {
            return true;
        } else {
            return false;
        }
    }
    makeDateObject() {
        // Utility: convert date input string to a Date object
        const splitString = this.dob?.value?.split('/');
        const reversedDateArray = splitString.reverse();
        const formattedDateString = reversedDateArray.join('-');
        const dateObj = new Date(formattedDateString);
        return dateObj;
    }
}