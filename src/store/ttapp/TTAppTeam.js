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
  _interval: any;

  constructor(config: { api: TTAppAPI, group: any, team: any }) {
    this._api = config.api;
    this._group = config.group;
    this._team = config.team;
    this._poule = observable.box({});
    this._lastUpdated = observable.box(new Date());
  }

  async init() {
    const poule = await this._api.getPoule(this.pouleId);
    runInAction(() => this._poule.set(poule));

    this._interval = setInterval(async () => {
      const { liveMatch } = this;
      if (liveMatch) {
        const poule = await this._api.getPoule(this.pouleId);
        runInAction(() => {
          this._poule.set(poule);
          this._lastUpdated.set(new Date());
        });
      }
    }, 10000);
  }

  cleanup() {
    clearInterval(this._interval);
    this._interval = undefined;
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

  getMatchForWeek(mom?: any): any {
    const { matches } = this;
    mom = mom || moment();
    const startOfWeek = mom.startOf('week').format('YYYY-MM-DD');
    const endOfWeek = mom.endOf('week').format('YYYY-MM-DD');
    return matches.find(
      match => match.playdate >= startOfWeek && match.playdate < endOfWeek,
    );
  }

  static startOfDay(date?: Date): any {
    const mom = moment(date);
    const hours = mom.get('hours');
    if (hours >= 0 && hours < 6) {
      return mom.add(-1, 'day').startOf('day');
    } else {
      return mom.startOf('day');
    }
  }

  static isMatchLive(match: any): boolean {
    const curtime = moment().format('YYYY-MM-DD HH:mm:ss');
    const endtime = TTAppTeam.startOfDay()
      .add(1, 'day')
      .add(3, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    return (
      curtime >= match.playtime && match.playtime < endtime && match.status <= 0
    );
  }

  get liveMatch(): any {
    return this.matches.find(TTAppTeam.isMatchLive);
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
