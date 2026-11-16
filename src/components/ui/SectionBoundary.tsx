import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { failed: boolean };

export class SectionBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="px-4 py-16 md:px-8" role="alert">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="font-display text-3xl tracking-tight">Work did not load</h2>
            <p className="mt-3 max-w-[65ch] leading-relaxed text-muted">
              Refresh the page to try this section again.
            </p>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
