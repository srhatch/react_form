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

// Also used in FormContext component
export const inputValuesInit = {
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  place: '',
  state: '',
  age: '',
  accountType: '',
  dob: ''
};

export default function Register() {
  const [formValues, setFormValues] = useState<InputValues>(inputValuesInit);
  const [errorObj, setErrorObj] = useState<ErrorObject>({});

  return (
    <ValidatingForm setParentValues={setFormValues}>
      <form className={styles.registerForm}>
        <TextInput
          componentName='register'
          inputFor='username'
          inputMode='text'
          isPassword={false}
          errorFor={errorObj.usernameFormatError ?? ''}
        />
        <TextInput
          componentName='register'
          inputFor='email'
          inputMode='email'
          isPassword={false}
          errorFor={errorObj.emailFormatError ?? ''}
        />
        <TextInput
          componentName='register'
          inputFor='password'
          inputMode='text'
          isPassword={true}
          errorFor={errorObj.passwordLengthError ?? ''}
        />
        <TextInput
          componentName='register'
          inputFor='passwordConfirm'
          inputMode='text'
          isPassword={true}
          errorFor={errorObj.passwordMatchError ?? ''}
        />
        <TextInput
          componentName='register'
          inputFor='place'
          inputMode='text'
          isPassword={false}
          errorFor=''
        />
        <DropdownInput
          componentName='register'
          inputFor='state'
          items={states}
          errorFor={errorObj.stateMissing ?? ''}
          labelText='State'
        />
        <DropdownFieldset
          componentName='register'
          inputFor='age'
          buttonText='Age range'
          items={['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99']}
          errorFor=''
        />
        <RadioInput
          componentName='register'
          inputFor='accountType'
          labelText='Account type'
          items={['basic', 'premium']}
          errorFor=''
        />
        <DateInput
          componentName='register'
          inputFor='dob'
          labelText='Date of birth'
          errorFor=''
        />
      </form>
    </ValidatingForm>
  )
}
