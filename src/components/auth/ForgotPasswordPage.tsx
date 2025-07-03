import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Activity, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearError();
    
    // Validate email
    if (!email.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Attempt to send reset email
    const success = await resetPassword(email);
    
    if (success) {
      setIsEmailSent(true);
    }
    
    setIsLoading(false);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Check Your Email
            </h1>
            <p className="mt-2 text-slate-600">Password reset instructions sent</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <div className="text-center space-y-4">
              <p className="text-slate-600">
                We've sent password reset instructions to:
              </p>
              <p className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg">
                {email}
              </p>
              <p className="text-sm text-slate-500">
                Please check your email and follow the instructions to reset your password.
                If you don't see the email, check your spam folder.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Button 
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                  clearError();
                }}
                variant="outline" 
                className="w-full"
              >
                Try Different Email
              </Button>
              
              <Link to="/login">
                <Button variant="secondary" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="mt-2 text-slate-600">Enter your email to receive reset instructions</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-slate-500">
                We'll send password reset instructions to this email address.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
