import { LogRemoteName } from '../middleware/log-remote-name';

export const enhancers = [];

if (window.devToolsExtension) {
  enhancers.push(window.devToolsExtension());
}

export interface RootState {
  counter: number;
}
