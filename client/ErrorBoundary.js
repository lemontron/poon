import React, { Component } from 'react';
import { Placeholder } from './Placeholder';

export class ErrorBoundary extends Component {
	state = {error: null};

	static getDerivedStateFromError(error) {
		return {error};
	}

	componentDidCatch(error, errorInfo) {
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
			return;
		}
		console.error(error, errorInfo);
	}

	componentDidUpdate(prevProps) {
		if (this.state.error && this.props.resetKey !== prevProps.resetKey) {
			this.setState({error: null});
		}
	}

	render() {
		const {children} = this.props;

		if (!this.state.error) return children;

		return (
			<Placeholder
				icon="error"
				title={this.state.error.name || 'Error'}
				message={this.state.error.message}
			/>
		);
	}
}
