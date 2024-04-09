// Defines the object that stores form input values
export interface InputValues {
    [index: string]: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    place: string;
    state: string;
    ageRange: string;
    dob: string;
}

export interface ErrorObject {
    [index: string]: any;
    usernameFormatError?: string;
    emailFormatError?: string;
    passwordLengthError?: string;
    passwordMatchError?: string;
    incorrectDropdownInput?: string;
    usernameMissing?: string;
    emailMissing?: string;
    passwordMissing?: string;
    passwordConfirmMissing?: string;
    placeMissing?: string;
    stateMissing?: string;
    ageRangeMissing?: string;
    dobMissing?: string;
    accountTypeMissing?: string;
}

export interface ActionObject {
    [index: string]: any;
    type: string;
    payload?: string | ErrorObject;
}

// Defines the value property of the form context
export interface ValidatingFormProps {
    children: React.ReactElement;
    setParentValues: (inputObject: any) => void;
    initValues: InputValues;
}

// Base interface for repeated component props.
export interface ComponentProps {
    componentName: string; // determines component-specific classNames
    inputFor: string; // determines input-specific label text, classNames, and name attribute
    errorFor: string; // determines displayed error text and acts as a flag to show other UI error markers
    errorMsg?: string; // Text display of client-side validation error
    dispatchError?: Function;
}

export interface TextInputProps extends ComponentProps {
    inputMode: "email" | "search" | "none" | "text" | "tel" | "url" | "numeric" | "decimal" | undefined;
    isPassword?: boolean;
}

export interface DropdownInputProps extends ComponentProps {
    items: string[];
    labelText: string;
}

export interface DropdownFieldsetProps extends ComponentProps {
    items: string[];
    buttonText: string;
}

export interface RadioInputProps extends ComponentProps {
    items: string[]; // Radio button choices
    labelText: string;
}

export interface DateInputProps extends ComponentProps {
    labelText: string;
}