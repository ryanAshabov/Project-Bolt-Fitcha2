import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Activity, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface EmailVerificationPageProps {
  email?: string;
}

export const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ 
  email: propEmail, 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const { resendEmailVerification, user, error, clearError } = useAuth();
  
  const userEmail = propEmail || user?.email || '';

  const handleResendVerification = async () => {
    clearError();
    setIsResending(true);
    setResendSuccess(false);
    
    const success = await resendEmailVerification();
    
    if (success) {
      setResendSuccess(true);
    }
    
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Verify Your Email
          </h1>
          <p className="mt-2 text-slate-600">Almost there! Just one more step.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message Display */}
          {resendSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">
                Verification email sent successfully!
              </p>
            </div>
          )}

          <div className="text-center space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <Mail className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-medium">
                We've sent a verification email to:
              </p>
              <p className="text-slate-900 font-semibold mt-2 break-all">
                {userEmail}
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <p>
                Click the verification link in your email to activate your account.
              </p>
              <p>
                Can't find the email? Check your spam or junk folder.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button 
              onClick={handleResendVerification}
              disabled={isResending}
              variant="outline" 
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Link to="/login">
              <Button variant="secondary" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already verified?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
          >
            <Activity className="h-4 w-4 mr-1" />
            Back to Fitcha
          </Link>
        </div>
      </div>
    </div>
  );
};
