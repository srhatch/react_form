// Defines the object that stores form input values
export interface InputValues {
    [index: string]: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    place: string;
    state: string
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

// Properties for the TextInput component
export interface TextInputProps {
    componentName: string; // determines component-specific classNames
    inputFor: string; // determines input-specific label text, classNames, and name attribute
    inputMode: "email" | "search" | "none" | "text" | "tel" | "url" | "numeric" | "decimal" | undefined;
    isPassword?: boolean;
    errorFor: string; // determines displayed error text and acts as a flag to show other UI error markers
}