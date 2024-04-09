'use client';
import styles from './Register.module.scss';
import { useState, useReducer, useEffect } from 'react';
import { InputValues, ErrorObject, ActionObject } from '../interfaces';
import { states } from '../stateList'; // Prop value for dropdown list
import ValidatingFormContext from './form_context/page';
import TextInput from './text_input/page';
import DropdownInput from './dropdown_input/page';
import DropdownFieldset from './dropdown_fieldset/page';
import RadioInput from './radio_input/page';
import DateInput from './date_input/page';
import { RegisterModel } from '../class_defs';
import errorReducer from './reducer';

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
  const [errorObj, dispatch] = useReducer(errorReducer, {});

  function handleRegisterSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const registerInstance = new RegisterModel(formValues);
    const errors = registerInstance.checkErrors(states); // Passing states to check for incorrect dropdown input
    if (errors) {
      dispatch({type: 'setError', payload: registerInstance.errorObj});
    } else {
      // Fetch to API endpoint
    }
  }

  return (
    <ValidatingFormContext setParentValues={setFormValues} initValues={formValues}>
      <form className={styles.registerForm} onSubmit={handleRegisterSubmit}>
        <TextInput
          componentName='register'
          inputFor='username'
          inputMode='text'
          isPassword={false}
          errorFor={(errorObj?.usernameMissing|| errorObj?.usernameFormatError) ?? ''}
          errorMsg='Username cannot end with ".com"'
          dispatchError={dispatch}
        />
        <TextInput
          componentName='register'
          inputFor='email'
          inputMode='email'
          isPassword={false}
          errorFor={(errorObj?.emailMissing || errorObj?.emailFormatError) ?? ''}
          errorMsg='Email must be in correct format'
          dispatchError={dispatch}
        />
        <TextInput
          componentName='register'
          inputFor='password'
          inputMode='text'
          isPassword={true}
          errorFor={(errorObj?.passwordMissing || errorObj?.passwordLengthError) ?? ''}
          errorMsg='Password must be at least 8 characters'
          dispatchError={dispatch}
        />
        <TextInput
          componentName='register'
          inputFor='passwordConfirm'
          inputMode='text'
          isPassword={true}
          errorFor={(errorObj?.passwordConfirmMissing || errorObj?.passwordMatchError) ?? ''}
          errorMsg='Passwords must match'
          dispatchError={dispatch}
        />
        <TextInput
          componentName='register'
          inputFor='place'
          inputMode='text'
          isPassword={false}
          errorFor={errorObj?.placeMissing ?? ''}
          dispatchError={dispatch}
        />
        <DropdownInput
          componentName='register'
          inputFor='state'
          labelText='State'
          items={states}
          errorFor={(errorObj?.stateMissing || errorObj?.incorrectDropdownInput) ?? ''}
          errorMsg='Please enter a valid state'
          dispatchError={dispatch}
        />
        <DropdownFieldset
          componentName='register'
          inputFor='ageRange'
          buttonText='Age range'
          items={['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99']}
          errorFor={errorObj?.ageRangeMissing ?? ''}
          dispatchError={dispatch}
        />
        <DateInput
          componentName='register'
          inputFor='dob'
          labelText='Date of birth'
          errorFor={errorObj?.dobMissing ?? ''}
          dispatchError={dispatch}
        />
        <RadioInput
          componentName='register'
          inputFor='accountType'
          labelText='Account type'
          items={['basic', 'premium']}
          errorFor={errorObj?.accountTypeMissing ?? ''}
          dispatchError={dispatch}
        />
        <input type='submit' className={styles.submitButton} value='Register' />
        {RegisterModel.checkMissingErrors(errorObj) && <div className='register-missingPrompt'>* Please fill in required fields</div>}
      </form>
    </ValidatingFormContext>
  )
}
