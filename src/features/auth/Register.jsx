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


const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, isRegistering, registerError, user } = useAuth(false); // Don't fetch by default
    const navigate = useNavigate();

    // Redirect if already logged in AND verified
    useEffect(() => {
        if (user?.isVerified) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, 'Name must be at least 2 characters')
                .required('Required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(6, 'Must be at least 6 characters')
                .required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values, { setErrors }) => {
            try {
                const { confirmPassword, ...registerData } = values;
                await register(registerData);

                // After successful registration, navigate to verification page
                // Don't wait for profile to load - user needs to verify email first
                navigate('/verify-email', {
                    replace: true,
                    state: {
                        email: values.email,
                        message: 'Registration successful! Please check your email for verification link.'
                    }
                });
            } catch (err) {
                const message = err?.response?.data?.message || 'Registration failed or email already in use.';
                setErrors({ general: message });
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
            <Card className="w-full max-w-md">
                <form onSubmit={formik.handleSubmit}>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                        <CardDescription>
                            Enter your information below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {(formik.errors.general || registerError?.response?.data?.message) && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {formik.errors.general || registerError?.response?.data?.message || 'Registration failed or email already in use.'}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-red-500 text-xs">{formik.errors.name}</div>
                            ) : null}
                        </div>

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
                            <Label htmlFor="password">Password</Label>
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
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isRegistering}>
                            {isRegistering ? 'Creating account...' : 'Create account'}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Register;
