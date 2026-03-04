import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useResetPassword } from './hooks/useResetPassword';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [tokenProcessed, setTokenProcessed] = useState(false);
    const { mutate: resetPassword, isPending, isSuccess, isError, error } = useResetPassword();

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'Must be at least 6 characters')
                .required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await resetPassword({ token, password: values.password });
            } catch (err) {
                // Error is handled by isError state
            }
        },
    });

    // Extract token and redirect to clean URL (hide token from address bar)
    useEffect(() => {
        if (token && !tokenProcessed) {
            navigate('/reset-password/form', { replace: true, state: { token } });
            setTokenProcessed(true);
        }
    }, [token, navigate, tokenProcessed]);

    // Get token from state if on form route
    const stateToken = window.history.state?.usr?.token;
    const effectiveToken = stateToken || token;

    if (!effectiveToken) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Invalid Link</CardTitle>
                        <CardDescription className="text-center">
                            The password reset link is invalid or missing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild>
                            <Link to="/forgot-password">Request New Link</Link>
                        </Button>
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
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Password Reset!</CardTitle>
                        <CardDescription className="text-center">
                            Your password has been successfully reset. You can now log in with your new password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild>
                            <Link to="/login">Go to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <Lock className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={formik.handleSubmit}>
                    <CardContent className="grid gap-4">
                        {isError && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error?.response?.data?.message || 'Failed to reset password. The link may have expired.'}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-xs">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                                className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Resetting...' : 'Reset Password'}
                        </Button>

                        <div className="text-sm text-center text-muted-foreground">
                            Remember your password?{' '}
                            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
};

export default ResetPassword;
