import { it, expect } from '@jest/globals';
import { processSubmit, checkErrors } from '../src/utilities/utils';
import RegisterModel from '../src/class_defs/register_model';

class TestInputData {
    constructor() {
        this.username = {value: 'testUser', errors: []};
        this.email = {value: 'test@test.com', errors: []};
        this.password = {value: 'testPassword', errors: []};
        this.passwordConfirm = {value: 'testPassword', errors: []};
        this.place = {value: 'Testville', errors: []};
        this.state = {value: 'California', errors: []};
        this.ageRange = {value: '20-29', errors: []};
        this.accountType = {value: 'basic', errors: []};
        this.dob = {value: '01/01/2000', errors: []};
        this.expectedDate = {value: new Date('01-01-2025'), errors: []};
    }
}

function generateFailTestData(prop, failValue) {
    // If testInputData is instantiated once, some tests will fail
    // (on the errors array length check) because previous tests will
    // modify that instance before the reference is passed to the Register constructor
    const testInputData = new TestInputData();
    testInputData[prop].value = failValue;
    const registerModel = new RegisterModel(testInputData);
    return registerModel;
}

describe('tests for processSubmit', () => {
    it('should return a boolean followed by register model instance', () => {
        const testInputData = new TestInputData();
        const [errors, registerInstance] = processSubmit(new RegisterModel(testInputData));
        expect(errors).toBe(false);
        expect(registerInstance).toBeInstanceOf(RegisterModel);
    });
    it('should signal an error if username contains ".com"', () => {
        const failData = generateFailTestData('username', 'testUser.com');
        const [errors, registerInstance] = processSubmit(failData);
        expect(errors).toBe(true);
        expect(registerInstance.username.errors).toHaveLength(1);
        expect(registerInstance.username.errors[0].isError).toBe(true);
        expect(registerInstance.username.errors[0].errorMsg).toBeTruthy();
    });
    describe('error signaling for email input', () => {
        it('should not signal an error if email is in correct format', () => {
            const passData = generateFailTestData('email', 'testUser@test.com');
            const [errors, registerInstance] = processSubmit(passData);
            expect(errors).toBe(false);
            expect(registerInstance.email.errors).toHaveLength(0);
        });
        it('should signal an error if email is missing @', () => {
            const failData = generateFailTestData('email', 'testUser.com');
            const [errors, registerInstance] = processSubmit(failData);
            expect(errors).toBe(true);
            expect(registerInstance.email.errors).toHaveLength(1);
            expect(registerInstance.email.errors[0].isError).toBe(true);
            expect(registerInstance.email.errors[0].errorMsg).toBeTruthy();
        });
        it('should signal an error if email is missing username part', () => {
            const failData = generateFailTestData('email', '@test.com');
            const [errors, registerInstance] = processSubmit(failData);
            expect(errors).toBe(true);
            expect(registerInstance.email.errors).toHaveLength(1);
            expect(registerInstance.email.errors[0].isError).toBe(true);
            expect(registerInstance.email.errors[0].errorMsg).toBeTruthy();
        });
        it('should signal an error if email is missing domain part', () => {
            const failData = generateFailTestData('email', 'testUser@');
            const [errors, registerInstance] = processSubmit(failData);
            expect(errors).toBe(true);
            expect(registerInstance.email.errors).toHaveLength(1);
            expect(registerInstance.email.errors[0].isError).toBe(true);
            expect(registerInstance.email.errors[0].errorMsg).toBeTruthy();
        });
    })
    it('should signal an error if password is < 8 characters', () => {
        const failData = generateFailTestData('password', 'short');
        const [errors, registerInstance] = processSubmit(failData);
        expect(errors).toBe(true);
        expect(registerInstance.password.errors).toHaveLength(1);
        expect(registerInstance.password.errors[0].isError).toBe(true);
        expect(registerInstance.password.errors[0].errorMsg).toBeTruthy();
    });
    it('should signal an error if password and passwordConfirm do not match', () => {
        const failData = generateFailTestData('passwordConfirm', 'something');
        const [errors, registerInstance] = processSubmit(failData);
        expect(errors).toBe(true);
        expect(registerInstance.passwordConfirm.errors).toHaveLength(1);
        expect(registerInstance.passwordConfirm.errors[0].isError).toBe(true);
        expect(registerInstance.passwordConfirm.errors[0].errorMsg).toBeTruthy();
    });
    it('should signal an error if dropdown input value is not in state list', () => {
        const failData = generateFailTestData('state', 'fakeState');
        const [errors, registerInstance] = processSubmit(failData);
        expect(errors).toBe(true);
        expect(registerInstance.state.errors).toHaveLength(1);
        expect(registerInstance.state.errors[0].isError).toBe(true);
        expect(registerInstance.state.errors[0].errorMsg).toBeTruthy();
    });
    it('should signal an error if dob length < 10', () => {
        const failData = generateFailTestData('dob', '1/1/24');
        const [errors, registerInstance] = processSubmit(failData);
        expect(errors).toBe(true);
        expect(registerInstance.dob.errors).toHaveLength(1);
        expect(registerInstance.dob.errors[0].isError).toBe(true);
        expect(registerInstance.dob.errors[0].errorMsg).toBeTruthy();
    });
    it('should signal an error if dob is after today', () => {
        const failData = generateFailTestData('dob', '01/01/25');
        const [errors, registerInstance] = processSubmit(failData);
        expect(errors).toBe(true);
        expect(registerInstance.dob.errors).toHaveLength(1);
        expect(registerInstance.dob.errors[0].isError).toBe(true);
        expect(registerInstance.dob.errors[0].errorMsg).toBeTruthy();
    });
    it('should signal an error if expectedDate is before today', () => {
        const failData = generateFailTestData('expectedDate', new Date('01-01-24'));
        const [errors, registerInstance] = processSubmit(failData);
        expect(errors).toBe(true);
        expect(registerInstance.expectedDate.errors).toHaveLength(1);
        expect(registerInstance.expectedDate.errors[0].isError).toBe(true);
        expect(registerInstance.expectedDate.errors[0].errorMsg).toBeTruthy();
    });
    it('should signal an error if all inputs are missing', () => {
        const failData = new RegisterModel({});
        const [errors, registerInstance] = processSubmit(failData);
        const registerInstanceValues = Object.values(registerInstance);
        const errorsLength = registerInstanceValues.every(value => value.errors.length = 1);
        // An error signal without an error message indicates that the (required) field is missing
        const missingErrors = registerInstanceValues.every(value => value.errors[0].isError && !value.errors[0].errorMsg);
        expect(errors).toBe(true);
        expect(errorsLength).toBe(true);
        expect(missingErrors).toBe(false);
    });
    it('should signal an error if some inputs are missing', () => {
        const failData = generateFailTestData('username', '');
        const [errors, registerInstance] = processSubmit(failData);
        const usernameErrors = registerInstance.username.errors;
        expect(errors).toBe(true);
        expect(usernameErrors).toHaveLength(1);
        expect(usernameErrors[0].isError).toBe(true);
        expect(usernameErrors[0].errorMsg).toBe('This field is required');
    });
})
describe('tests for checkErrors', () => {
    it('should return false with no errors', () => {
        const passData = new TestInputData();
        const [errors, registerInstance] = processSubmit(passData);
        const isErrors = checkErrors(registerInstance);
        expect(isErrors).toBe(false);
    })
    it('should return true with an invalid input', () => {
        const failData = generateFailTestData('username', 'test.com');
        const [errors, registerInstance] = processSubmit(failData);
        const isErrors = checkErrors(registerInstance);
        expect(isErrors).toBe(true);
    })
})