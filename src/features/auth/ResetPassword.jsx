import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useResetPassword } from './hooks/useResetPassword';
import { useAuth } from './hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Get token from URL query param or location state
    const urlToken = searchParams.get('token');
    const stateToken = location.state?.token;
    const effectiveToken = urlToken || stateToken;
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { mutate: resetPassword, isPending, isSuccess, isError, error } = useResetPassword();

    // Redirect if already logged in and verified
    useEffect(() => {
        if (user?.isVerified) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

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
        onSubmit: async (values, { setErrors }) => {
            if (!effectiveToken) {
                setErrors({ general: 'Reset token is missing. Please request a new password reset link.' });
                return;
            }
            
            try {
                await resetPassword({ token: effectiveToken, password: values.password });
            } catch (err) {
                const message = err?.response?.data?.message || 'Failed to reset password. The link may have expired.';
                setErrors({ general: message });
            }
        },
    });

    // Show invalid link message if no token
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
                        {formik.errors.general && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {formik.errors.general}
                            </div>
                        )}
                        
                        {isError && !formik.errors.general && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error?.response?.data?.message || 'Failed to reset password. The link may have expired.'}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    className={formik.touched.password && formik.errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-xs">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmPassword}
                                    className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
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
