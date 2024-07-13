// Defines the object stored in inputValues state variable and in RegisterModel class properties
export interface InputObject {
    [index: string]: any;
    value: string | object;
    errors: ErrorObject[];
}

// Defines the state variable held in the form context component
export interface FormInputValues {
    [key: string]: InputObject
}

export interface ErrorObject {
    isError: boolean;
    errorMsg: string;
}

// Defines the value property of the form context
export interface ValidatingFormProps {
    children: JSX.Element|JSX.Element[];
    processSubmit: (inputObject: any) => (boolean | any)[];
    fetchFunction: undefined;
}

// Base interface for repeated component props.
export interface ComponentProps {
    children?: JSX.Element|JSX.Element[];
    componentName: string; // determines component-specific classNames
    inputFor: string; // determines input-specific label text, classNames, and name attribute
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
    dateFormat: string;
}

export interface DateSelectorProps extends ComponentProps {
    labelText: string;
}

// Info content interface
export interface InfoProps {
    infoContent: string;
}