'use client';
import { states } from '../data/stateList'; // Prop value for dropdown list
import ValidatingFormContext from './form_context/page';
import TextInput from './text_input/page';
import DropdownInput from './dropdown_input/page';
import DropdownFieldset from './dropdown_fieldset/page';
import RadioInput from './radio_input/page';
import DateInput from './date_input/page';
// import { fetchFunction } from 'route/to/data/service';

export default function Register() {
  return (
    <ValidatingFormContext fetchFunction={undefined}>
        <TextInput
          componentName='register'
          inputFor='username'
          labelText='Username'
          inputMode='text'
          isPassword={false}
        />
        <TextInput
          componentName='register'
          inputFor='email'
          labelText='Email'
          inputMode='email'
          isPassword={false}
        />
        <TextInput
          componentName='register'
          inputFor='password'
          labelText='Password'
          inputMode='text'
          isPassword={true}
        />
        <TextInput
          componentName='register'
          inputFor='passwordConfirm'
          labelText='Confirm password'
          inputMode='text'
          isPassword={true}
        />
        <TextInput
          componentName='register'
          inputFor='place'
          labelText='City/town'
          inputMode='text'
          isPassword={false}
        />
        <DropdownInput
          componentName='register'
          inputFor='state'
          labelText='State'
          items={states}
        />
        <DropdownFieldset
          componentName='register'
          inputFor='ageRange'
          buttonText='Age range'
          items={['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99']}
        />
        <DateInput
          componentName='register'
          inputFor='dob'
          labelText='Date of birth'
        />
        <RadioInput
          componentName='register'
          inputFor='accountType'
          labelText='Account type'
          items={['basic', 'premium']}
        />
    </ValidatingFormContext>
  )
}
