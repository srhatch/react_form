'use client';
import styles from './Register.module.scss';
import { useState } from 'react';
import { InputValues, ErrorObject } from '../interfaces';
import { states } from '../stateList'; // Prop value for dropdown list
import ValidatingForm from './form_context/page';
import TextInput from './text_input/page';
import DropdownInput from './dropdown_input/page';
import DropdownFieldset from './dropdown_fieldset/page';
import RadioInput from './radio_input/page';
import DateInput from './date_input/page';
import { RegisterModel } from '../class_defs';

const inputValuesInit = {
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  place: '',
  state: '',
  ageRange: '',
  accountType: '',
  dob: ''
};

export default function Register() {
  const [formValues, setFormValues] = useState<InputValues>(inputValuesInit);
  const [errorObj, setErrorObj] = useState<ErrorObject>({});

  function handleRegisterSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const registerInstance = new RegisterModel(formValues);
    const errors = registerInstance.checkErrors(states); // Passing states to check for incorrect dropdown input
    if (errors) {
      setErrorObj(registerInstance.errorObj);
    } else {
      // Fetch to API endpoint
    }
  }
  console.log(errorObj)
  return (
    <ValidatingForm setParentValues={setFormValues} initValues={formValues}>
      <form className={styles.registerForm} onSubmit={handleRegisterSubmit}>
        <TextInput
          componentName='register'
          inputFor='username'
          inputMode='text'
          isPassword={false}
          errorFor={(errorObj?.usernameFormatError || errorObj?.usernameMissing) ?? false}
          errorMsg={errorObj?.usernameFormatError ? 'Username cannot end with ".com"' : ''}
        />
        <TextInput
          componentName='register'
          inputFor='email'
          inputMode='email'
          isPassword={false}
          errorFor={(errorObj?.emailFormatError || errorObj?.emailMissing) ?? false}
          errorMsg={errorObj?.emailFormatError ? 'Email must be in correct format' : ''}
        />
        <TextInput
          componentName='register'
          inputFor='password'
          inputMode='text'
          isPassword={true}
          errorFor={(errorObj?.passwordLengthError || errorObj?.passwordMissing) ?? false}
          errorMsg={errorObj?.passwordLengthError ? 'Password must be at least 8 characters' : ''}
        />
        <TextInput
          componentName='register'
          inputFor='passwordConfirm'
          inputMode='text'
          isPassword={true}
          errorFor={(errorObj?.passwordMatchError || errorObj?.passwordConfirmMissing) ?? false}
          errorMsg={errorObj?.passwordMatchError ? 'Passwords must match' : ''}
        />
        <TextInput
          componentName='register'
          inputFor='place'
          inputMode='text'
          isPassword={false}
          errorFor={errorObj?.placeMissing ?? false}
        />
        <DropdownInput
          componentName='register'
          inputFor='state'
          labelText='State'
          items={states}
          errorFor={(errorObj?.stateMissing || errorObj?.incorrectDropdownInput) ?? false}
          errorMsg='Please enter a valid state'
        />
        <DropdownFieldset
          componentName='register'
          inputFor='ageRange'
          buttonText='Age range'
          items={['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99']}
          errorFor={errorObj?.ageRangeMissing ?? false}
        />
        <DateInput
          componentName='register'
          inputFor='dob'
          labelText='Date of birth'
          errorFor={errorObj?.dobMissing ?? false}
        />
        <RadioInput
          componentName='register'
          inputFor='accountType'
          labelText='Account type'
          items={['basic', 'premium']}
          errorFor={errorObj?.accountTypeMissing ?? false}
        />
        <input type='submit' className={styles.submitButton} value='Register' />
        {RegisterModel.checkMissingErrors(errorObj) && <div className='register-missingPrompt'>* Please fill in required fields</div>}
      </form>
    </ValidatingForm>
  )
}
