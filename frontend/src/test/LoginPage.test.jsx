import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AuthContext from '../context/AuthContext';

const mockLogin = vi.fn();

const renderLoginPage = (loginFn = mockLogin) => {
  return render(
    <AuthContext.Provider value={{ login: loginFn }}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('LoginPage Component Tests', () => {
  it('should render username and password fields and submit button', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should display validation errors when fields are empty and submitted', async () => {
    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should trigger login function with credentials when form is valid', async () => {
    renderLoginPage();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'tilak_user' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'tilak_user',
        password: 'password123',
      });
    });
  });
});
