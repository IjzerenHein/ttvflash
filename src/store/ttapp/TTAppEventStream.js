/* @flow */
import { TTAppTeam } from './TTAppTeam';

export interface TTAppEvent {
  type: 'matchStarted' | 'matchEnded' | 'matchUpdated';
  team: TTAppTeam;
  match: any;
  prevMatch: any;
  scoredTeamId?: number;
  scoredTeamName?: string;
}

export class TTAppEventStream {
  _queue: TTAppEvent[] = [];

  push(event: TTAppEvent) {
    if (this._queue.length > 50) this._queue.splice(0, 1);
    this._queue.push(event);
  }

  pop(): ?TTAppEvent {
    if (this.isEmpty) return undefined;
    const event = this._queue[0];
    this._queue.splice(0, 1);
    return event;
  }

  get isEmpty(): boolean {
    return this._queue.length ? false : true;
  }
}
