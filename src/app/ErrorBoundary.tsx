import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production this is where a reporter (Sentry, etc.) would be called.
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-stone-600">
          The view crashed, but your saved profile is intact. Try reloading this section.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-stone-900 p-3 text-left text-[11px] text-rose-300">
          {this.state.error.message}
        </pre>
        <div className="mt-5 flex justify-center gap-2">
          <button
            onClick={this.reset}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-stone-500"
          >
            Reload app
          </button>
        </div>
      </div>
    );
  }
}
