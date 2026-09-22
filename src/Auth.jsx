import React, { useState } from 'react';
import { supabase } from './supabase.js';

export default function Auth({ onClose }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    setMsg('');
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    try {
      if (mode === 'signin') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        const user = data.user ?? (await supabase.auth.getUser()).data.user;
        if (!user) {
          setError('Sign-in completed without an active session. Please try again.');
          return;
        }

        setMsg('Signed in successfully.');
        if (onClose) onClose();
        return;
      }

      if (!normalizedName) {
        setError('Please enter your full name.');
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { full_name: normalizedName },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!data.user) {
        setError('We could not create the account. Please try again.');
        return;
      }

      if (data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists. Switch to Sign in and use your password.');
        setMode('signin');
        return;
      }

      if (!data.session) {
        setMsg('Account created. Check your email and confirm your address before signing in.');
        return;
      }

      setMsg('Account created successfully.');
      if (onClose) onClose();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="auth-card" onSubmit={submit}>
        <button type="button" className="close" onClick={onClose}>×</button>
        <p className="eyebrow">CRAVE HOUSE ACCOUNT</p>
        <h2>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>

        {mode === 'signup' && (
          <input
            placeholder="Full name"
            value={name}
            onChange={event => setName(event.target.value)}
            autoComplete="name"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          minLength={6}
          required
        />

        {error && <p className="notice error">{error}</p>}
        {msg && <p className="notice">{msg}</p>}

        <button className="primary full" disabled={busy} type="submit">
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <button
          type="button"
          className="link-button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError('');
            setMsg('');
          }}
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
