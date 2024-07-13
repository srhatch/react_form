import { it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../src/app/page';
import statesList from '../src/data/stateList';
import userEvent from '@testing-library/user-event';

describe('dropdown input', () => {
    it('should render a dropdown menu when valid input is typed', () => {
        render(<Register />);
        const stateInput = screen.getByLabelText('State');
        const dropdownContainer = screen.getByTestId('dropdown-container');
        fireEvent.change(stateInput, {
            target: {
                value: 'm'
            }
        });
        const stateList = screen.getByRole('listbox');
        expect(dropdownContainer).toContainElement(stateList);
    });
    it('should not render the dropdown if invalid input is typed', () => {
        render(<Register />);
        const stateInput = screen.getByLabelText('State');
        fireEvent.change(stateInput, {
            target: {
                value: 'q'
            }
        });
        const stateList = screen.queryByRole('listbox');
        expect(stateList).toBe(null);
    });
    it('should render a correctly filtered list for one state', () => {
        render(<Register />);
        const stateInput = screen.getByLabelText('State');
        fireEvent.change(stateInput, {
            target: {
                value: 'texas'
            }
        });
        const stateList = screen.queryByRole('listbox');
        expect(stateList.children).toHaveLength(1);
    });
    it('should render a correctly filtered list for multiple possible choices', () => {
        render(<Register />);
        const stateInput = screen.getByLabelText('State');
        fireEvent.change(stateInput, {
            target: {
                value: 'm'
            }
        });
        const stateList = screen.queryByRole('listbox');
        expect(stateList.children).toHaveLength(8);
    });
    it('should render a correctly filtered list for state with two words', () => {
        render(<Register />);
        const stateInput = screen.getByLabelText('State');
        fireEvent.change(stateInput, {
            target: {
                value: 'new hampshire'
            }
        });
        const stateList = screen.queryByRole('listbox');
        expect(stateList.children).toHaveLength(1);
    });
})
describe('dropdown fieldset', () => {
    it('should render a dropdown menu when dropdown fieldset button is clicked', async () => {
        const { user } = userEventSetup(<Register />, render);
        const dropdownButton = screen.getByText('Age range');
        await user.click(dropdownButton);
        const dropdownMenuContainer = screen.getAllByRole('group');
        const dropdownMenu = screen.getByRole('listbox');
        expect(dropdownMenuContainer[0]).toContainElement(dropdownMenu);
    });
    test('dropdown menu should close when escape key is pressed', async () => {
        const { user } = userEventSetup(<Register />, render);
        const dropdownButton = screen.getByText('Age range');
        await user.click(dropdownButton);
        await user.keyboard('{Escape}');
        const dropdownMenuContainer = screen.getAllByRole('group');
        const dropdownMenu = screen.queryByRole('listbox');
        expect(dropdownMenuContainer[0]).not.toContainElement(dropdownMenu);
    });
    test('dropdown menu should close when mouse click is outside menu', async () => {
        const { user } = userEventSetup(<Register />, render);
        const dropdownButton = screen.getByText('Age range');
        await user.click(dropdownButton);
        const form = screen.getByRole('form');
        await user.click(form);
        const dropdownMenuContainer = screen.getAllByRole('group');
        const dropdownMenu = screen.queryByRole('listbox');
        expect(dropdownMenuContainer[0]).not.toContainElement(dropdownMenu);
    });
    test('tab key closes dropdown menu', async () => {
        const { user } = userEventSetup(<Register />, render);
        const dropdownButton = screen.getByText('Age range');
        dropdownButton.focus();
        await user.click(dropdownButton);
        await user.keyboard('{Tab}');
        const dropdownMenuContainer = screen.getAllByRole('group');
        const dropdownMenu = screen.queryByRole('listbox');
        expect(dropdownMenuContainer[0]).not.toContainElement(dropdownMenu);
    });
})
describe('info component', () => {
    it('should show and hide the info display on mouseenter and mouseleave respectively', () => {
        render(<Register />);
        const infoButton = screen.getByText('?'); // Can change this to getAll if there are multiple
        fireEvent.mouseEnter(infoButton);
        const infoDisplay = screen.getByText('This is just an example of how this component might be used, hence the vague "expected date" name');
        expect(infoDisplay).toBeVisible();
        fireEvent.mouseLeave(infoButton);
        expect(infoDisplay).not.toBeVisible();
    });
    it('should show and hide the info display on focus and blur respectively', () => {
        render(<Register />);
        const infoButton = screen.getByText('?'); // Can change this to getAll if there are multiple
        fireEvent.focus(infoButton);
        const infoDisplay = screen.getByText('This is just an example of how this component might be used, hence the vague "expected date" name');
        expect(infoDisplay).toBeVisible();
        fireEvent.blur(infoButton);
        expect(infoDisplay).not.toBeVisible();
    });
})
describe('input error signaling', () => {
    test('all inputs signal an error  if missing with a * in the label', () => {
        render(<Register />);
        const form = screen.getByRole('form', {name: 'Example form'});
        fireEvent.submit(form);
        const errorLabels = screen.getAllByText(/[*$]/);
        expect(errorLabels).toHaveLength(11); // 10 inputs plus a general error message
    });
    it('should remove error signaling onchange (username)', () => {
        render(<Register />);
        const form = screen.getByRole('form', {name: 'Example form'});
        fireEvent.submit(form);
        const usernameInput = screen.getByLabelText('Username *');
        const usernameLabel = screen.getByText('Username *');
        expect(usernameLabel).toBeInTheDocument();
        fireEvent.change(usernameInput, {
            target: {
                value: 'some text'
            }
        });
        const usernameLabelCheck = screen.queryByText('Username *');
        expect(usernameLabelCheck).toBe(null);
    });
    it('should remove error signaling onchange (state)', () => {
        render(<Register />);
        const form = screen.getByRole('form', {name: 'Example form'});
        fireEvent.submit(form);
        const stateInput = screen.getByLabelText('State *');
        const stateInputLabel = screen.getByText('State *');
        expect(stateInputLabel).toBeInTheDocument();
        fireEvent.change(stateInput, {
            target: {
                value: 'some text'
            }
        });
        const stateLabelCheck = screen.queryByText('State *');
        expect(stateLabelCheck).toBe(null);
    });
    it('should remove error signaling onchange (ageRange)', () => {
        render(<Register />);
        const form = screen.getByRole('form', {name: 'Example form'});
        fireEvent.submit(form);
        const ageRangeButton = screen.getByText('Age range *');
        expect(ageRangeButton).toBeInTheDocument();
        fireEvent.click(ageRangeButton);
        const dropdownMenu = screen.getByRole('listbox');
        const firstButton = dropdownMenu.children[0].firstElementChild;
        fireEvent.click(firstButton);
        const ageRangeLabelCheck = screen.queryByText('Age range *');
        expect(ageRangeLabelCheck).toBe(null);
    });
    it('should remove error signaling onchange (dob)', () => {
        render(<Register />);
        const form = screen.getByRole('form', {name: 'Example form'});
        fireEvent.submit(form);
        const dobLabel = screen.getByText('Date of birth *');
        expect(dobLabel).toBeInTheDocument();
        const dobInput = screen.getByLabelText('Date of birth *');
        fireEvent.keyDown(dobInput, {key: '0', charCode: 48});
        fireEvent.change(dobInput, {
            target: {
                value: '0'
            }
        });
        const dobLabelCheck = screen.queryByText('Date of birth *');
        expect(dobLabelCheck).toBe(null);
    });
    it('should remove error signaling onchange (accountType)', () => {
        render(<Register />);
        const form = screen.getByRole('form', {name: 'Example form'});
        fireEvent.submit(form);
        const accountTypeInput = screen.getByText('Basic');
        const accountTypeLabel = screen.getByText('Account type *');
        expect(accountTypeLabel).toBeInTheDocument();
        fireEvent.click(accountTypeInput);
        const accountTypeLabelCheck = screen.queryByText('Account type *');
        expect(accountTypeLabelCheck).toBe(null);
    });
    it('should remove error signaling onchange (expectedDate)', () => {
        render(<Register />);
        const form = screen.getByRole('form', {name: 'Example form'});
        fireEvent.submit(form);
        const expectedDateInput = screen.getByLabelText(/Expected date \*/, {selector: 'input'});
        const expectedDateLabel = screen.getByText(/Expected date \*/);
        expect(expectedDateLabel).toBeInTheDocument();
        fireEvent.change(expectedDateInput, {
            target: {
                value: '01-01-2025'
            }
        });
        const expectedDateLabelCheck = screen.queryByText(/Expected date \*/);
        expect(expectedDateLabelCheck).toBe(null);
    });
});


function userEventSetup(jsx, renderFunction) {
    return {
        user: userEvent.setup(),
        ...renderFunction(jsx)
    }
}