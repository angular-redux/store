export function invariant(condition: boolean, message: string, context?: any) {
  if (!condition) {
    let errorMessage = message;

    if (context) {
      errorMessage = (message.indexOf('%s') !== -1) ?
        message.replace('%s', context) :
        errorMessage = `${message}: ${context}`;
    }

    throw new Error(errorMessage);
  }
}
