// Defines the object that stores form input values
export interface InputValues {
    [index: string]: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    place: string;
    state: string;
    title: string;
}

export interface ErrorObject {
    usernameFormatError?: string;
    emailFormatError?: string;
    passwordLengthError?: string;
    passwordMatchError?: string;
    stateMissing?: string;
}

// Defines the value property of the form context
export interface ValidatingFormProps {
    children: React.ReactElement;
    setParentValues: (inputObject: InputValues) => void;
    initValues?: InputValues;
}

// Base interface for repeated component props.
export interface ComponentProps {
    componentName: string; // determines component-specific classNames
    inputFor: string; // determines input-specific label text, classNames, and name attribute
    errorFor: string; // determines displayed error text and acts as a flag to show other UI error markers
    errorMsg?: string; // Text display of client-side validation error
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
}