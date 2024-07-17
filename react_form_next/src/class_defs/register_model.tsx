import { InputObject, FormInputValues } from '../types/interfaces';
import { checkErrors } from '../utilities/utils';
import states from '../data/stateList';

class RegisterModel {
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
    expectedDate: InputObject;
    constructor(inputObj: FormInputValues) {
        this.username = inputObj.username ?? {value: '', errors: []};
        this.email = inputObj.email ?? {value: '', errors: []};
        this.password = inputObj.password ?? {value: '', errors: []};
        this.passwordConfirm = inputObj.passwordConfirm ?? {value: '', errors: []};
        this.place = inputObj.place ?? {value: '', errors: []};
        this.state = inputObj.state ?? {value: '', errors: []};
        this.ageRange = inputObj.ageRange ?? {value: '', errors: []};
        this.accountType = inputObj.accountType ?? {value: '', errors: []};
        this.dob = inputObj.dob ?? {value: '', errors: []};
        this.expectedDate = inputObj.expectedDate ?? {value: '', errors: []};
    }

    checkMissing() {
        for (let prop in this) {
            if (!this[prop]?.value) {
                this[prop].errors.push({isError: true, errorMsg: 'This field is required'});
            }
        }
    }
    checkUsernameFormat() {
        if (this.username?.value?.endsWith('.com')) {
            this.username.errors.push({
                isError: true,
                errorMsg: 'Username cannot end with ".com"'
            })
        };
    }
    checkEmailFormat() {
        // Basic email address validation
        const emailAddress = this.email.value;
        let isValid = true;
        if (emailAddress.includes('@')) {
            const emailArray = emailAddress.split('@');
            const domainRe = /^(?!.*[^\w\.-])/;
            if (emailArray[0].length > 64) {
                isValid = false;
            } else if (emailArray[1].length > 255 || !domainRe.test(emailArray[1])) {
                isValid = false;
            }
        } else {
            isValid = false;
        }
        if (!isValid) {
            this.email.errors.push({
                isError: true,
                errorMsg: 'Email must be in correct format (username@domain)'
            });
        }
    }
    checkPasswordMatch() {
        if (this.password.value !== this.passwordConfirm.value) {
            this.passwordConfirm.errors.push({
                isError: true,
                errorMsg: 'Passwords must match'
            });
        }
    }
    checkPasswordLength() {
        if (this.password?.value?.length < 8) {
            this.password.errors.push({
                isError: true,
                errorMsg: 'Password must be at least 8 characters'
            });
        }
    }
    checkDropdownInput(fullList: string[]) {
        // Pass in the list (array) that was passed to the dropdown input
        // Checks whether user input exists in that list
        if (this.state?.value && !fullList.includes(this.state?.value)) {
            this.state.errors.push({
                isError: true,
                errorMsg: 'Please enter a valid state'
            });
        }
    }
    checkDobLength() {
        // If date input is too short then it can't be valid
        if (this.dob?.value?.length < 10) {
            this.dob.errors.push({
                isError: true,
                errorMsg: 'Please enter valid date (MM/DD/YYYY)'
            });
        }
    }
    checkDobValid() {
        const inputDate = this.makeDateObject('dob');
        const currentDate = new Date();
        if (currentDate < inputDate) {
            this.dob.errors.push({
                isError: true,
                errorMsg: 'DOB must be before today'
            });
        }
    }
    checkExpectedDateValid() {
        const currentDate = new Date();
        const expectedDate = new Date(this.expectedDate.value);
        if (currentDate > expectedDate) {
            this.expectedDate.errors.push({
                isError: true,
                errorMsg: 'Expected date must be after today'
            });
        }
    }
    validate() {
        // Interfaces with form component as a wrapper function
        // Returns true if any errors exist
        this.checkMissing();
        const isMissingErrors = checkErrors(this);
        if (isMissingErrors) {
            return true;
        } else {
            this.checkUsernameFormat();
            this.checkPasswordLength();
            this.checkPasswordMatch();
            this.checkEmailFormat();
            this.checkDropdownInput(states);
            this.checkDobLength();
            this.checkDobValid();
            this.checkExpectedDateValid();
            const isFormatErrors = checkErrors(this);
            if (isFormatErrors) {
                return true;
            }
        }
        return false;
    }
    makeDateObject(dateProp: string) {
        // Utility: convert date input string to a Date object
        const splitString = this[dateProp]?.value?.split('/');
        const reversedDateArray = splitString.reverse();
        const formattedDateString = reversedDateArray.join('-');
        const dateObj = new Date(formattedDateString);
        return dateObj;
    }
}
export default RegisterModel;