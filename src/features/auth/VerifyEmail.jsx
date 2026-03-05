import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import { CheckCircle, Loader2, Mail, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useResendVerificationEmail } from './hooks/useResendVerificationEmail';
import { useVerifyEmail } from './hooks/useVerifyEmail';
import { useAuth } from './hooks/useAuth';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = searchParams.get('token');
    const [showResend, setShowResend] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail();
    const { mutate: resendEmail, isPending: isResending, isSuccess: isResent } = useResendVerificationEmail();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            resendEmail(values.email);
        },
    });

    // Auto-redirect after successful verification
    useEffect(() => {
        if (isSuccess && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
        if (isSuccess && countdown === 0) {
            navigate('/login');
        }
    }, [isSuccess, countdown, navigate]);

    useEffect(() => {
        if (token) {
            verifyEmail(token);
        }
    }, [token]);

    if (isResent) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Email Sent!</CardTitle>
                        <CardDescription className="text-center">
                            We've sent a new verification link to your email address. Please check your inbox.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/login">Back to Login</Link>
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Didn't receive the email?{' '}
                            <button
                                type="button"
                                onClick={() => formik.handleSubmit()}
                                className="text-primary underline-offset-4 hover:underline"
                                disabled={isPending}
                            >
                                Resend
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (showResend) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <Mail className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Resend Verification Email</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email address and we'll send you a new verification link.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={formik.handleSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-xs">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <Button type="submit" className="w-full" disabled={isResending}>
                                {isResending ? 'Sending...' : 'Resend Verification Link'}
                            </Button>

                            <Button type="button" variant="outline" onClick={() => setShowResend(false)} className="w-full">
                                Back
                            </Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Invalid Link</CardTitle>
                        <CardDescription className="text-center">
                            The verification link is invalid or missing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Button asChild className="w-full">
                            <Link to="/register">Go to Sign Up</Link>
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowResend(true)} className="w-full">
                            Resend Verification Email
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Verifying Email</CardTitle>
                        <CardDescription className="text-center">
                            Please wait while we verify your email address...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-8">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Email Verified!</CardTitle>
                        <CardDescription className="text-center">
                            Your email has been successfully verified. Redirecting you to login in {countdown} second{countdown !== 1 ? 's' : ''}...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild>
                            <Link to="/login">Go to Login Now</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError) {
        // Check if it's a CORS/network error
        const isCorsError = error?.message?.includes('CORS') || !error?.response;

        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <XCircle className="h-16 w-16 text-red-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Verification Failed</CardTitle>
                        <CardDescription className="text-center">
                            {isCorsError
                                ? 'Unable to connect to server. Please try again later or contact support.'
                                : error?.response?.data?.message || 'The verification link is invalid or has expired.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        {!isCorsError && (
                            <Button asChild className="w-full">
                                <Link to="/register">Try Again</Link>
                            </Button>
                        )}
                        <Button type="button" variant="outline" onClick={() => setShowResend(true)} className="w-full">
                            Resend Verification Email
                        </Button>
                        {isCorsError && (
                            <p className="text-xs text-center text-muted-foreground">
                                If this keeps happening, please contact support.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
};

export default VerifyEmail;
