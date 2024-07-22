'use client';
import states from '../data/stateList'; // Prop value for dropdown list
import ValidatingFormContext from './components/form_context/page';
import TextInput from './components/text_input/page';
import DropdownInput from './components/dropdown_input/page';
import DropdownFieldset from './components/dropdown_fieldset/page';
import RadioInput from './components/radio_input/page';
import DateInput from './components/date_input/page';
import DateSelector from './components/date_selector/page';
import Info from './components/info/page';
import { processSubmit } from '../utilities/utils';
// import { fetchFunction } from 'route/to/data/service';

export default function Register() {
  return (
    <ValidatingFormContext fetchFunction={undefined} processSubmit={processSubmit} submitButtonValue='Register'>
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
          dateFormat='mm/dd/yyyy'
        />
        <RadioInput
          componentName='register'
          inputFor='accountType'
          labelText='Account type'
          items={['basic', 'premium']}
        />
        <DateSelector
          componentName='register'
          inputFor='expectedDate'
          labelText='Expected date'
        >
          <Info forInput='expectedDate' infoContent='This is just an example of how this component might be used, hence the vague "expected date" name'/>
        </DateSelector>
    </ValidatingFormContext>
  )
}
