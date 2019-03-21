/* @flow */
import { observable, runInAction } from 'mobx';
import type { IObservableValue } from 'mobx';
import { TTAppAPI } from './TTAppAPI';
import moment from 'moment';

export class TTAppTeam {
  _api: TTAppAPI;
  _group: any;
  _team: any;
  _poule: IObservableValue<any>;
  _lastUpdated: IObservableValue<Date>;

  constructor(config: { api: TTAppAPI, group: any, team: any }) {
    this._api = config.api;
    this._group = config.group;
    this._team = config.team;
    this._poule = observable.box({});
    this._lastUpdated = observable.box(new Date());
    this._init();
  }

  async _init() {
    const poule = await this._api.getPoule(this.pouleId);
    runInAction(() => this._poule.set(poule));

    setInterval(async () => {
      const { todaysMatch } = this;
      if (todaysMatch && todaysMatch.status !== 0) {
        const poule = await this._api.getPoule(this.pouleId);
        runInAction(() => {
          this._poule.set(poule);
          this._lastUpdated.set(new Date());
        });
      }
    }, 10000);
  }

  get players(): Array<any> {
    return this._team.players;
  }

  get matches(): Array<any> {
    return (this._poule.get().matches || []).filter(
      match => match.team1id === this.teamId || match.team2id === this.teamId,
    );
  }

  get lastUpdated(): Date {
    return this._lastUpdated.get();
  }

  get todaysMatch(): any {
    const { matches } = this;
    const playdate = moment().format('YYYY-MM-DD');
    return matches.find(match => match.playdate === playdate);
    // return matches[0];
    // return null;
  }

  get teamId(): number {
    return this._team.teamid;
  }

  get teamName(): string {
    return this._team.teamname;
  }

  get pouleId(): string {
    return this._team.pouleid;
  }

  get pouleName(): string {
    return this._team.poulename;
  }

  get regionName(): string {
    return this._poule.get().regionname;
  }

  get seasonName(): string {
    return this._poule.get().seasonname;
  }

  get groupId(): string {
    return this._group.groupid;
  }

  get groupName(): string {
    return this._group.groupname;
  }
}
