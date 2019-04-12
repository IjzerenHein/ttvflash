/* @flow */
import { observable, runInAction, toJS } from 'mobx';
import type { IObservableValue } from 'mobx';
import { TTAppAPI } from './TTAppAPI';
import moment from 'moment';
import { TTAppEventStream } from './TTAppEventStream';

export class TTAppTeam {
  _api: TTAppAPI;
  _group: any;
  _team: any;
  _poule: IObservableValue<any>;
  _lastUpdated: IObservableValue<Date>;
  _interval: any;
  _eventStream: TTAppEventStream;

  constructor(config: {
    api: TTAppAPI,
    group: any,
    team: any,
    eventStream: TTAppEventStream,
  }) {
    this._api = config.api;
    this._eventStream = config.eventStream;
    this._group = config.group;
    this._team = config.team;
    this._poule = observable.box({});
    this._lastUpdated = observable.box(new Date());
  }

  async init() {
    const poule = await this._api.getPoule(this.pouleId);
    runInAction(() => this._poule.set(poule));

    let prevLiveMatch = toJS(this.liveMatch);
    this._interval = setInterval(async () => {
      const { liveMatch } = this;
      if (liveMatch) {
        if (!prevLiveMatch) {
          prevLiveMatch = toJS(liveMatch);
          this._eventStream.push({
            team: this,
            type: 'matchStarted',
            match: prevLiveMatch,
            prevMatch: prevLiveMatch,
          });
        }

        const poule = await this._api.getPoule(this.pouleId);
        runInAction(() => {
          this._poule.set(poule);
          this._lastUpdated.set(new Date());
        });

        const newLiveMatch = this.liveMatch || liveMatch;
        if (
          (newLiveMatch.score1 || 0) !== (prevLiveMatch.score1 || 0) ||
          (newLiveMatch.score2 || 0) !== (prevLiveMatch.score2 || 0)
        ) {
          this._onMatchUpdated(prevLiveMatch, toJS(newLiveMatch));
        }
        prevLiveMatch = toJS(newLiveMatch);
      } else if (prevLiveMatch) {
        this._eventStream.push({
          team: this,
          type: 'matchEnded',
          match: prevLiveMatch,
          prevMatch: prevLiveMatch,
        });
        prevLiveMatch = undefined;
      }
    }, 60000);
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
    mom = mom || moment(this._api.currentDate);
    const startOfWeek = mom.startOf('week').format('YYYY-MM-DD');
    const endOfWeek = mom.endOf('week').format('YYYY-MM-DD');
    return matches.find(
      match => match.playdate >= startOfWeek && match.playdate < endOfWeek,
    );
  }

  isMatchLive(match: any): boolean {
    const curtime = moment(this._api.currentDate).format('YYYY-MM-DD HH:mm:ss');
    const endtime = moment(match.playdate)
      .startOf('day')
      .add(1, 'day')
      .add(3, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    return (
      curtime >= match.playtime &&
      curtime < endtime &&
      match.score1 + match.score2 !== 10
    );
  }

  get liveMatch(): any {
    return this.matches.find(match => this.isMatchLive(match));
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

  _onMatchUpdated(prevMatch: any, match: any) {
    const team1Scored = (match.score1 || 0) > (prevMatch.score1 || 0);
    this._eventStream.push({
      team: this,
      type: 'matchUpdated',
      prevMatch,
      match,
      scoredTeamId: team1Scored ? match.team1id : match.team2id,
      scoredTeamName: team1Scored ? match.team1name : match.team2name,
    });
  }
}
