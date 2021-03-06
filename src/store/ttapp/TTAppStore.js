/* @flow */
import { observable, runInAction } from 'mobx';
import type { IObservableValue, IObservableArray } from 'mobx';
import { TTAppAPI } from './TTAppAPI';
import { TTAppTeam } from './TTAppTeam';
import moment from 'moment';
import { TTAppEventStream } from './TTAppEventStream';
import type { Club, Match } from './types';

// const CLUB_ID = '1057';
const CLUB_ID = '1088'; // Flash

export class TTAppStore {
  _api = new TTAppAPI();
  _eventStream = new TTAppEventStream();
  _isEnabled: IObservableValue<boolean> = observable.box(false);
  _club: IObservableValue<Club> = observable.box({});
  _teams: IObservableArray<TTAppTeam> = observable.array([]);
  _groups: IObservableValue<any> = observable.box(undefined);
  _lastUpdated: IObservableValue<?Date> = observable.box(undefined);

  get isEnabled(): boolean {
    return this._isEnabled.get();
  }

  get club(): Club {
    return this._club.get();
  }

  get teams(): IObservableArray<TTAppTeam> {
    return this._teams;
  }

  get eventStream(): TTAppEventStream {
    return this._eventStream;
  }

  getMatchesForWeek(
    weekOffset: number = 0,
    isYouth: boolean = false,
  ): Array<{
    team: TTAppTeam,
    match: Match,
    isLive: boolean,
  }> | void {
    const date = moment(this._api.currentDate).add(weekOffset, 'week');
    const result = this.teams
      .filter(team => team.isYouthTeam === isYouth)
      .map(team => {
        const match = team.getMatchForWeek(date);
        return {
          team,
          match,
          isLive: match ? team.isMatchLive(match) : undefined,
        };
      })
      .filter(({ match }) => match);
    //.sort((a, b) => a.match.playtime.localeCompare(b.match.playtime));
    // $$FlowFixMe
    return result.length ? result : undefined;
  }

  get lastUpdated(): ?Date {
    let lastUpdated = this._lastUpdated.get();
    if (!lastUpdated) return undefined;
    this.teams.forEach(team => {
      const lu = team.lastUpdated;
      // $FlowFixMe
      if (lu.getTime() > lastUpdated.getTime()) lastUpdated = lu;
    });
    return lastUpdated;
  }

  get currentDate(): ?Date {
    return this._api.currentDate;
  }

  async init(clubId: string = CLUB_ID) {
    await this._api.login();
    const { club, groups } = await this._api.getTeams(clubId);

    const teams = [];
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      for (let j = 0; j < group.teams.length; j++) {
        const teamInfo = group.teams[j];

        const team = new TTAppTeam({
          api: this._api,
          group,
          team: teamInfo,
          eventStream: this._eventStream,
        });
        teams.push(team);
        team.init();
      }
    }
    teams.sort((a, b) => a.teamNumber - b.teamNumber);
    runInAction(() => {
      this._lastUpdated.set(new Date());
      this._club.set(club);
      this._teams.replace(teams);
    });
  }

  async cleanup() {
    this.teams.forEach(team => team.cleanup());
    runInAction(() => {
      this._lastUpdated.set(undefined);
      this._club.set({});
      this._teams.replace([]);
    });
  }
}
