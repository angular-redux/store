import { Injectable } from '@angular/core';

/**
 * Simple service designed to demonstrate using a DI-injected
 * service in your action creators.
 */
@Injectable()
export class RandomNumberService {
  pick() {
    return Math.floor(Math.random() * 100);
  }
}
