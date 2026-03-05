import { useFormik } from 'formik';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from './hooks/useAuth';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggingIn, loginError, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(6, 'Must be at least 6 characters')
                .required('Required'),
        }),
        onSubmit: async (values, { setErrors }) => {
            try {
                const result = await login(values);
                
                // Check if user is verified
                const user = result?.user || result?.data?.user;
                if (user && !user.isVerified) {
                    // User is not verified - redirect to verification page
                    navigate('/verify-email', { 
                        replace: true,
                        state: { 
                            email: values.email,
                            message: 'Please verify your email to continue.'
                        }
                    });
                } else {
                    // User is verified - redirect to home
                    navigate('/', { replace: true });
                }
            } catch (err) {
                const message = err?.response?.data?.message || 'Invalid credentials. Please try again.';
                setErrors({ general: message });
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
            <Card className="w-full max-w-md">
                <form onSubmit={formik.handleSubmit}>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {(formik.errors.general || loginError?.response?.data?.message) && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {formik.errors.general || loginError?.response?.data?.message || 'Invalid credentials. Please try again.'}
                            </div>
                        )}

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

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
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
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground flex flex-col gap-1">
                            <span>
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                                    Sign up
                                </Link>
                            </span>
                            <span>
                                Didn't receive verification email?{' '}
                                <Link to="/resend-verification" className="text-primary underline-offset-4 hover:underline">
                                    Resend
                                </Link>
                            </span>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Login;
