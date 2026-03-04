import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useResendVerificationEmail } from './hooks/useResendVerificationEmail';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';

const ResendVerification = () => {
    const { mutate: resendEmail, isPending, isSuccess, isError, error } = useResendVerificationEmail();

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

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Email Sent!</CardTitle>
                        <CardDescription className="text-center">
                            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
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
                        {isError && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error?.response?.data?.message || 'Failed to resend verification email. Please try again.'}
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

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Sending...' : 'Send Verification Link'}
                        </Button>

                        <div className="text-sm text-center text-muted-foreground">
                            Already verified?{' '}
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

export default ResendVerification;
