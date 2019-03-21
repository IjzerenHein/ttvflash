/* @flow */
import { reaction, observable } from 'mobx';
import type { IObservableValue } from 'mobx';

const CLUB_ID = '1057';

export class TTAppStore {
  _token = undefined;
  _uid = undefined;
  _tokenCorrection = undefined;
  _isEnabled: IObservableValue<boolean> = observable.box(false);
  _teams: IObservableValue<any> = observable.box(undefined);

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

  async init() {
    await this.login();
    await this.getTeams(CLUB_ID);
  }

  async cleanup() {}

  async request(fields: any) {
    fields.c = 'site-300';
    if (this._uid) fields.uid = this._uid;
    if (this._token) {
      var t = (
        '' +
        Math.floor(
          (new Date().getTime() + this._tokenCorrection) / 1e3 + 483058413,
        )
      ).split('');
      fields.token =
        '' +
        t[4] +
        t[9] +
        t[5] +
        t[2] +
        Math.floor(10 * Math.random()) +
        t[3] +
        t[0] +
        t[6] +
        t[1] +
        t[7] +
        t[8] +
        Math.floor(1e3 * Math.random());
    }

    const body = JSON.stringify(fields);
    console.log(`FETCHing ${body}...`);
    try {
      const response = await fetch('https://ttapp.nl/api', {
        method: 'post',
        body: JSON.stringify(fields),
      });
      if (response.status !== 200)
        throw new Error(`Invalid status: ${response.status}`);
      console.log(`FETCHing DONE (status: ${response.status})`);
      const json = await response.json();
      console.log(json);
      return json;
    } catch (err) {
      console.log(`FETCH FAILED (${err.message})`);
      throw err;
    }
  }

  async login(): Promise<void> {
    const response = await this.request({
      task: 'login',
    });
    this._token = response.token + '';
    this._uid = response.uid;
    this._tokenCorrection = 1e3 * this._token - new Date().getTime();
  }

  getTeams(clubId: string): Promise<any> {
    return this.request({
      task: 'club',
      clubid: CLUB_ID,
      tab: 't',
      semester: 20191,
    });
  }

  getPoule(teamId: string): Promise<any> {
    return this.request({
      task: 'poule',
      p: teamId,
      tab: 'w',
    });
  }
}
