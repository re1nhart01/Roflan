import type { ErrorInfo, PropsWithChildren } from 'react';
import React, { Component } from 'react';

import { Localization } from '@core/constants/localization.ts';
import { Screen } from '@components/atoms/screen/Screen';
import { EmptyScreen } from '@components/molecules/empty-screen/EmptyScreen';
import { DEVICE_HEIGHT } from '@core/constants/defaults.ts';

type errorBoundaryComponentProps = PropsWithChildren<object>;

class ErrorBoundaryComponent extends Component<
  errorBoundaryComponentProps,
  { hasError: boolean }
> {
  constructor(props: errorBoundaryComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // const customEvent: Event = {
    //   message: "ErrorBoundary error",
    //   level: "error",
    //   extra: {
    //     error: error.toString(),
    //     errorInfo: errorInfo.toString(),
    //     dev: __DEV__,
    //   },
    // };
    // crashlytics().recordError(
    //   new Error(JSON.stringify(customEvent)),
    //   "ErrorBoundary componentDidCatch"
    // );
    // Sentry.captureEvent(customEvent);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Screen>
          <EmptyScreen
            text={Localization.errors.unexpectedError}
            marginTop={DEVICE_HEIGHT / 2.5}
          />
        </Screen>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundaryComponent };
