import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import SentMailInbox from './SentMailInbox';

// Mocking axios to avoid actual API calls
jest.mock('axios');

describe('SentMailInbox Component', () => {
  it('renders no emails available message when there are no emails', () => {
    render(<SentMailInbox />);
    expect(screen.getByText('No emails available')).toBeInTheDocument();
  });

  it('renders the list of emails when there are emails', () => {
    // Mock axios get response
    const mockResponse = {
      data: [
        {
          _id: '1',
          sender: 'example@example.com',
          subject: 'Test Subject 1',
          body: 'Test Body 1',
        },
        {
          _id: '2',
          sender: 'another@example.com',
          subject: 'Test Subject 2',
          body: 'Test Body 2',
        },
      ],
    };
    axios.get.mockResolvedValue(mockResponse);

    render(<SentMailInbox />);
    expect(screen.getByText('example@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test Subject 1')).toBeInTheDocument();
    expect(screen.getByText('Test Body 1')).toBeInTheDocument();
    expect(screen.getByText('another@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test Subject 2')).toBeInTheDocument();
    expect(screen.getByText('Test Body 2')).toBeInTheDocument();
  });

  it('displays error message on email fetch failure', async () => {
    // Mock axios get error
    axios.get.mockRejectedValue(new Error('Failed to fetch emails'));

    render(<SentMailInbox />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Could not fetch mails')).toBeInTheDocument();
    });
  });
});
