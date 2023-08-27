import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Compose from './Compose';

// Mocking axios to avoid actual API calls
jest.mock('axios');

describe('Compose Component', () => {
  it('renders the form elements', () => {
    render(<Compose />);
    expect(screen.getByLabelText('From :')).toBeInTheDocument();
    expect(screen.getByLabelText('To :')).toBeInTheDocument();
    expect(screen.getByLabelText('Sub :')).toBeInTheDocument();
    expect(screen.getByLabelText('Compose Email :')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('submits the email with correct data', async () => {
    // Mock axios post response
    const mockResponse = { data: { msg: 'Email sent successfully' } };
    axios.post.mockResolvedValue(mockResponse);

    render(<Compose />);
    const toInput = screen.getByLabelText('To :');
    const subjectInput = screen.getByLabelText('Sub :');
    const editor = screen.getByRole('textbox', { name: 'Compose Email :' });
    const sendButton = screen.getByRole('button', { name: 'Send' });

    userEvent.type(toInput, 'example@example.com');
    userEvent.type(subjectInput, 'Test Subject');
    fireEvent.change(editor, { target: { value: 'Test Email Content' } });
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'https://mail-box-1-d23c1-default-rtdb.firebaseio.com/mailcompose.json',
        {
          receiver: 'example@example.com',
          body: 'Test Email Content',
          subject: 'Test Subject',
          opened: false,
        }
      );
      expect(screen.getByText('Email sent successfully')).toBeInTheDocument();
    });
  });

  it('displays error message on email submission failure', async () => {
    // Mock axios post error
    axios.post.mockRejectedValue(new Error('Failed to send email'));

    render(<Compose />);
    const toInput = screen.getByLabelText('To :');
    const subjectInput = screen.getByLabelText('Sub :');
    const editor = screen.getByRole('textbox', { name: 'Compose Email :' });
    const sendButton = screen.getByRole('button', { name: 'Send' });

    userEvent.type(toInput, 'example@example.com');
    userEvent.type(subjectInput, 'Test Subject');
    fireEvent.change(editor, { target: { value: 'Test Email Content' } });
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
