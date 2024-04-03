'use client';
import styles from './Register.module.scss';
import { useState } from 'react';
import { InputValues, ErrorObject } from '../interfaces';
import { states } from '../stateList'; // Prop value for dropdown list
import ValidatingForm from './form_context/page';
import TextInput from './text_input/page';
import DropdownInput from './dropdown_input/page';

// Also used in FormContext component
export const inputValuesInit = {
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  place: '',
  state: ''
}

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
      </form>
    </ValidatingForm>
  )
}
