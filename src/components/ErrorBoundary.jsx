import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        // Log to error reporting service (e.g., Sentry)
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
                    <Card className="w-full max-w-md">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center mb-4">
                                <AlertTriangle className="h-16 w-16 text-red-500" />
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight text-center">
                                Something went wrong
                            </CardTitle>
                            <CardDescription className="text-center">
                                We're sorry, but the application encountered an unexpected error.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="p-3 bg-muted rounded-md">
                                <p className="text-sm font-mono text-muted-foreground break-all">
                                    {this.state.error?.toString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={this.handleReload} className="flex-1">
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                    Reload Page
                                </Button>
                                <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                                    <Home className="h-4 w-4 mr-2" />
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
