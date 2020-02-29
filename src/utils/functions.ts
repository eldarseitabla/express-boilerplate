/// <reference types="playfab-sdk/Scripts/typings/PlayFab/PlayFab" />

export const compileErrorReport = (error: string | PlayFabModule.IPlayFabError): string => {
  if (error === null) {
    return '';
  }

  if (typeof error === 'string') {
    return error;
  }

  let fullErrors: string = error.errorMessage;
  for (const paramName in error.errorDetails)
    for (const msgIdx in error.errorDetails[paramName])
      fullErrors += '\n' + paramName + ': ' + error.errorDetails[paramName][msgIdx];
  return fullErrors;
};
