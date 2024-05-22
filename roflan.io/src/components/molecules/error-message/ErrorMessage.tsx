import { isEmpty } from 'ramda';
import React, { useCallback } from 'react';

import { Localization } from '@core/constants/localization.ts';
import { ErrorMessageStyles } from './errorMessage.styles';

const { ErrorMessageText } = ErrorMessageStyles;

type ErrorMessageProps = {
  errorMessage: string;
  marginTop?: number;
  marginBottom?: number;
  alignment?: 'center' | 'left' | 'right';
  hideIfTextEmpty?: boolean;
};

export const ErrorMessage = ({
  errorMessage,
  marginTop,
  marginBottom,
  alignment,
  hideIfTextEmpty,
}: ErrorMessageProps) => {

  if (hideIfTextEmpty && isEmpty(errorMessage)) {
    return null;
  }

  return (
    <ErrorMessageText
      alignment={alignment}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {errorMessage}
    </ErrorMessageText>
  );
};
