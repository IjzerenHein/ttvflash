/* @flow */
import { reaction, observable, runInAction } from 'mobx';
import type { IObservableValue, IObservableArray } from 'mobx';
import { TTAppAPI } from './TTAppAPI';
import { TTAppTeam } from './TTAppTeam';

const CLUB_ID = '1057';

export class TTAppStore {
  _api = new TTAppAPI();
  _isEnabled: IObservableValue<boolean> = observable.box(false);
  _club: IObservableValue<any> = observable.box({});
  _teams: IObservableArray<TTAppTeam> = observable.array([]);
  _groups: IObservableValue<any> = observable.box(undefined);
  _lastUpdated: IObservableValue<Date> = observable.box(undefined);

  constructor(config: { isEnabled: () => boolean }) {
    reaction(
      config.isEnabled,
      isEnabled => {
        this._isEnabled.set(isEnabled);
        if (isEnabled) {
          this.init();
        } else {
          this.cleanup();
        }
      },
      { fireImmediately: true },
    );
  }

  get isEnabled(): boolean {
    return this._isEnabled.get();
  }

  get club(): any {
    return this._club.get();
  }

  get teams(): IObservableArray<TTAppTeam> {
    return this._teams;
  }

  get todaysTeams(): Array<TTAppTeam> {
    return this.teams.filter(team => team.todaysMatch);
  }

  get lastUpdated(): ?Date {
    let lastUpdated = this._lastUpdated.get();
    const { todaysTeams } = this;
    if (!lastUpdated) return undefined;
    todaysTeams.forEach(team => {
      const lu = team.lastUpdated;
      if (lu.getTime() > lastUpdated.getTime()) lastUpdated = lu;
    });
    return lastUpdated;
  }

  async init() {
    await this._api.login();
    const { club, groups } = await this._api.getTeams(CLUB_ID);

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
      }
    }
    runInAction(() => {
      this._lastUpdated.set(new Date());
      this._club.set(club);
      this._teams.replace(teams);
    });
  }

  async cleanup() {}
}
