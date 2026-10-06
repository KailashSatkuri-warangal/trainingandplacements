import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fbfbf9] text-[#111318] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#e6e6df] p-8 shadow-sm text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-display text-[#111318]">
                Something went wrong
              </h2>
              <p className="text-xs text-[#6b7280] mt-1.5 leading-relaxed">
                An unexpected interface issue occurred. You can reload this view or return to the main recruitment board.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] font-mono text-neutral-600 text-left overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home Portal</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
