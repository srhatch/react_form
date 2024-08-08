# react_form
## An example form component with various types of inputs
<br><br>
The main purpose of this component is to provide responsive client-side validation. Error signaling (either through text or other UI features) will occur after the form is submitted if there are any issues with its children inputs. The form component doubles as a context through which child components can have their input values controlled. Error signaling is determined in the form component, specifically the onSubmit handler, with the child input components determining error CSS class selectors and other specifics about how to display the error.
<br><br>
The input components are agnostic about what their purpose is. This is decided in whichever component calls them by configuring an input's props. Input values are passed to the form component through functions passed down to individual inputs with context.
<br><br>
The form component can interface with code to check validity (in this example a class is used to represent form values). Whatever structure that validity-checking code takes, it must work with and return objects in a specific shape, in this example defined by the following two Typescript interfaces:
<br><br>
<code>interface InputObject {
&nbsp;&nbsp;value: string;
&nbsp;&nbsp;errors: ErrorObject[];
}</code>
<code>interface ErrorObject {
&nbsp;&nbsp;errorFor: string;
&nbsp;&nbsp;errorMsg: string;
}</code>
<br><br>
This is the shape that the form component's "inputValues" state variable will take (an object in which each property is an InputObject). This shape ensures that error information is paired with the input value that caused it. errorFor specifies what kind of error is occurring, and errorMsg is the actual UI message to be displayed (left empty if the error doesn't need a message).
<br><br>
The DropdownInput component takes in a list of string items that will be used as the menu options. On submission, the input should be checked against this list to ensure that the input is a valid option (in this example that is done with the checkDropdownInput method).
<br><br>
Edit:<br>
I changed the structure so that the ValidatingForm component can take in a function that will be called when the form submits. This takes the place of the RegisterModel and makes the component more extensible. The only thing the form component cares about is that the function returns an array with two values: a boolean indicating the presence of any errors, and an instance of the inputValues object. The way in which those values are calculated can now be left up to individual implementation (functional or OOP).
<br><br>
Change to reducer-form-functions branch to see the ValidatingForm component used with a reducer.
<br><br><br>
Functionality can be examined by running the next dev server:
Change directory to react_form_next
Run command "npm run dev"
Open a browser to http://localhost:3000