// Defines the object stored in inputValues state variable and in RegisterModel class properties
export interface InputObject {
    [index: string]: any;
    value: string;
    errors: ErrorObject[];
}
export interface ErrorObject {
    errorFor: string;
    errorMsg: string;
}

// Defines the value property of the form context
export interface ValidatingFormProps {
    children: JSX.Element|JSX.Element[];
    fetchFunction: undefined;
}

// Base interface for repeated component props.
export interface ComponentProps {
    componentName: string; // determines component-specific classNames
    inputFor: string; // determines input-specific label text, classNames, and name attribute
    errorFor?: string; // determines displayed error text and acts as a flag to show other UI error markers
    errorMsg?: string; // Text display of client-side validation error
    dispatchError?: Function;
}

export interface TextInputProps extends ComponentProps {
    inputMode: "email" | "search" | "none" | "text" | "tel" | "url" | "numeric" | "decimal" | undefined;
    isPassword?: boolean;
    labelText: string;
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