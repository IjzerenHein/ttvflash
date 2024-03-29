/* @flow */
import type { Poule, Match, Club, Group, Semester } from './types';

const ENABLE_CACHE = false;

/* Reserve engineered from ttapp */
function decodeGDResponse(_0x3e8d2f) {
  function decode(_0x3e8d2f) {
    return decodeURIComponent(
      Array['prototype']['map']
        ['call'](atob(_0x3e8d2f['replace'](/\s/g, '')), function (_0x3e8d2f) {
          return (
            '%' +
            ('00' + _0x3e8d2f['charCodeAt'](0x0)['toString'](0x10))['slice'](
              -0x2,
            )
          );
        })
        ['join'](''),
    );
  }
  const _0x510d78 = _0x3e8d2f['match'](/^(.)(.)/);
  return decode(
    _0x3e8d2f['replace'](new RegExp(_0x510d78[0x2], 'g'), '@')
      ['replace'](/A/g, _0x510d78[0x2])
      ['replace'](/@/g, 'A')
      ['replace'](new RegExp(_0x510d78[0x1], 'g'), '@')
      ['replace'](/e/g, _0x510d78[0x1])
      ['replace'](/@/g, 'e')
      ['replace'](/^../, 'ey'),
  );
}

export class TTAppAPI {
  _token = undefined;
  _uid = undefined;
  _tokenCorrection = undefined;

  async request(fields: any) {
    const cacheKey = JSON.stringify(fields);
    const cache = localStorage.getItem(cacheKey);
    if (cache && ENABLE_CACHE) {
      const json = JSON.parse(cache);
      console.log(json);
      return json;
    }

    fields.c = 'site-324';
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
    //console.log(`FETCHing ${body}...`);
    try {
      const response = await fetch('https://ttapp.nl/api', {
        method: 'post',
        body,
      });
      if (response.status !== 200)
        throw new Error(`Invalid status: ${response.status}`);
      //console.log(`FETCHing DONE (status: ${response.status})`);
      const encodedJson = await response.json();
      const json = JSON.parse(decodeGDResponse(encodedJson.gd));
      localStorage.setItem(cacheKey, JSON.stringify(json));
      //console.log(json);
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

  getTeams(
    clubId: string,
    semester: number = 0,
  ): Promise<{
    club: Club,
    groups: Array<Group>,
    semesters: Array<Semester>,
  }> {
    if (!semester) {
      const date = new Date();
      semester = date.getFullYear() * 10 + (date.getMonth() > 6 ? 2 : 1);
    }
    return this.request({
      task: 'club',
      clubid: clubId,
      tab: 't',
      semester,
    });
  }

  getPoule(teamId: number): Promise<Poule> {
    return this.request({
      task: 'poule',
      p: teamId,
      tab: 'm',
    });
  }

  getMatch(matchId: string): Promise<Match> {
    return this.request({
      task: 'match',
      matchid: matchId,
    });
  }

  get currentDate(): ?Date {
    // return new Date('2019-03-23T03:00:00');
    return undefined; // undefined = now
  }
}
