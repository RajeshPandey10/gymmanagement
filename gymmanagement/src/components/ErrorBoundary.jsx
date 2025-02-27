import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // You can also log the error to an error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="text-center p-8 bg-white rounded-lg shadow-xl">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-4">
                            We're sorry - something's gone wrong on our end.
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                            onClick={() => this.setState({ hasError: false })}
                        >
                            Go Back Home
                        </Link>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 