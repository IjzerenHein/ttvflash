/* @flow */
import { observable, runInAction } from 'mobx';
import type { IObservableValue, IObservableArray } from 'mobx';
import { TTAppAPI } from './TTAppAPI';
import { TTAppTeam } from './TTAppTeam';
import moment from 'moment';

// const CLUB_ID = '1057';
const CLUB_ID = '1088'; // Flash

export class TTAppStore {
  _api = new TTAppAPI();
  _isEnabled: IObservableValue<boolean> = observable.box(false);
  _club: IObservableValue<any> = observable.box({});
  _teams: IObservableArray<TTAppTeam> = observable.array([]);
  _groups: IObservableValue<any> = observable.box(undefined);
  _lastUpdated: IObservableValue<?Date> = observable.box(undefined);

  get isEnabled(): boolean {
    return this._isEnabled.get();
  }

  get club(): any {
    return this._club.get();
  }

  get teams(): IObservableArray<TTAppTeam> {
    return this._teams;
  }

  getMatchForWeek(weekOffset: number = 0): Array<any> | void {
    const date = moment(this._api.currentDate).add(weekOffset, 'week');
    const result = this.teams
      .map(team => {
        const match = team.getMatchForWeek(date);
        return {
          team,
          match,
          isLive: match ? team.isMatchLive(match) : undefined,
        };
      })
      .filter(({ match }) => match)
      .sort((a, b) => a.match.playtime.localeCompare(b.match.playtime));
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
        });
        teams.push(team);
        team.init();
      }
    }
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
