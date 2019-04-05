/* @flow */
import React, { Component } from 'react';
import { observer, TTAppStore } from '../../store';
import Clock from 'react-live-clock';
import * as moment from 'moment';
import 'moment/locale/nl';
import { Howl } from 'howler';

const Colors = {
  red: '#a90201',
  lightGray: '#f8f8f8',
  gray: '#e7e7e7',
};

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid ' + Colors.gray,
  },
  header: {
    backgroundColor: Colors.lightGray,
    borderBottom: '1px solid ' + Colors.gray,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
    height: '102px',
  },
  headerLeft: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '2px 2px 12px 16px',
  },
  footerLeft: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  matches: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  noMatches: {
    padding: '0 16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchContainer: {
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid ' + Colors.gray,
    height: '50px',
  },
  matchFooter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  live: {
    backgroundColor: Colors.red,
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'white',
    padding: '1px 4px',
    marginRight: '8px',
  },
  left: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  section: {
    padding: '8px 16px 4px 16px',
  },
  ownteam: {
    color: Colors.red,
  },
  body: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 17,
    // lineHeight: '19px',
    fontWeight: 'bold',
  },
  body2: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 15,
    fontWeight: 'bold',
  },
  caption: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 15,
    color: 'gray',
  },
  heading1: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 44,
    fontWeight: 'bold',
  },
  heading2: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 30,
    fontWeight: 'bold',
  },
  heading3: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 24,
    fontWeight: 'bold',
  },
};

interface PropsType {
  delay: number;
  clubId?: string;
}

interface StateType {
  pageIndex: number;
}

const PageIndex = {
  CURRENT: 0,
  PREVIOUS: 1,
  STANDINGS: 2,
};

class TTApp extends Component<PropsType, StateType> {
  _timer: any;
  _eventTimer: any;
  _store = new TTAppStore();

  state = {
    pageIndex: 0,
  };

  componentDidMount() {
    this._store.init(this.props.clubId);
    this._timer = setInterval(() => {
      this.setState({
        pageIndex: (this.state.pageIndex + 1) % 2,
      });
    }, this.props.delay ? this.props.delay * 1000 : 10000);
    this._eventTimer = setInterval(() => {
      const event = this._store.eventStream.pop();
      if (event) {
        this.onEvent(event);
      }
    }, 10000);
    // this.playSound(require('../../assets/audio/kermis.m4a'));
  }

  componentWillUnmount() {
    this._store.cleanup();
    clearInterval(this._timer);
    this._timer = undefined;
    clearInterval(this._eventTimer);
    this._eventTimer = undefined;
  }

  renderTeamName(teamid, teamname, team) {
    const isOwnTeam = teamid === team.teamId;
    const name =
      isOwnTeam && team.groupName !== 'Senioren'
        ? `${team.groupName} ${teamname}`
        : teamname;
    return <span style={isOwnTeam ? styles.ownteam : undefined}>{name}</span>;
  }

  renderMatch(team, match, isLive) {
    return (
      <div style={styles.matchContainer} key={team.teamId}>
        <div style={styles.left}>
          <div style={styles.body}>
            {this.renderTeamName(match.team1id, match.team1name, team)}
            {' - '}
            {this.renderTeamName(match.team2id, match.team2name, team)}
          </div>
          {/*<div style={styles.caption}>{`${team.pouleName}`}</div>*/}
          <div style={styles.matchFooter}>
            {isLive ? <div style={styles.live}>Live</div> : undefined}
            <div style={styles.caption}>{`${moment(match.playtime).format(
              'dddd D MMMM, HH:mm',
            )}`}</div>
          </div>
        </div>
        <div style={styles.heading3}>{`${match.result.replace(
          '(ovb)',
          '',
        )}`}</div>
      </div>
    );
  }

  renderMatches(matches) {
    if (!matches) {
      return (
        <div style={styles.noMatches}>
          <div style={styles.body}>{`Er zijn geen`}</div>
          <div style={styles.body}>{`wedstrijden gevonden`}</div>
        </div>
      );
    }
    return (
      <div style={styles.matches}>
        {matches.map(({ team, match, isLive }) =>
          this.renderMatch(team, match, isLive),
        )}
      </div>
    );
  }

  renderStandings() {
    // TODO
    return undefined;
  }

  renderHeader(matches) {
    let title = '';
    /*const subTitle = matches
        ? `${moment(matches[0].match.playdate)
            .startOf('week')
            .format('dddd D MMMM')} - ${moment(matches[0].match.playdate)
            .endOf('week')
            .format('dddd D MMMM')}`
        : moment().format('dddd D MMMM');*/
    const subTitle = 'Powered by TTApp';
    switch (this.state.pageIndex) {
      case PageIndex.CURRENT:
        title = 'Deze week';
        break;
      case PageIndex.PREVIOUS:
        title = 'Vorige week';
        break;
      case PageIndex.STANDINGS:
        title = 'Standen';
        break;
      default:
        break;
    }

    return (
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.heading2}>{title}</div>
          <div style={styles.caption}>{subTitle}</div>
        </div>
        <Clock ticking={true} style={styles.heading1} />
      </div>
    );
  }

  renderFooter() {
    const { lastUpdated } = this._store;
    return (
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <div style={styles.body2}>{`Powered by TTApp`}</div>
          <div style={styles.caption}>{`Laatst bijgewerkt ${
            lastUpdated ? moment(lastUpdated).format('HH:MM') : ''
          }`}</div>
        </div>
        <img
          src={require('../../assets/ttapp.png')}
          height={44}
          alt="ttapp-logo"
        />
      </div>
    );
  }

  render() {
    const { pageIndex } = this.state;
    const matches =
      pageIndex === PageIndex.PREVIOUS
        ? this._store.getMatchForWeek(-1) ||
          this._store.getMatchForWeek(-2) ||
          this._store.getMatchForWeek(-3)
        : this._store.getMatchForWeek(0) ||
          this._store.getMatchForWeek(1) ||
          this._store.getMatchForWeek(2);
    return (
      <div style={styles.container}>
        {this.renderHeader(matches)}
        {pageIndex === PageIndex.STANDINGS
          ? this.renderStandings()
          : this.renderMatches(matches)}
        {/*this.renderFooter()*/}
      </div>
    );
  }

  onEvent(event) {
    console.log('onEvent: ', event.type, ', team: ', event.team.teamName);
    switch (event.type) {
      case 'matchUpdated':
        if (event.match.score1 > event.prevMatch.score1) {
          if (event.team.teamId === event.match.team1id) {
            this.onHooray(
              event.team,
              event.match.score1 - event.prevMatch.score1,
            );
          } else {
            this.onBooohoo(
              event.team,
              event.match.score1 - event.prevMatch.score1,
            );
          }
        } else if (event.match.score2 > event.prevMatch.score2) {
          if (event.team.teamId === event.match.team2id) {
            this.onHooray(
              event.team,
              event.match.score2 - event.prevMatch.score2,
            );
          } else {
            this.onBooohoo(
              event.team,
              event.match.score2 - event.prevMatch.score2,
            );
          }
        }
        break;
      default:
        break;
    }
  }

  onHooray(team: any, points: number) {
    this.playSound(require('../../assets/audio/kermis.m4a'));
  }

  onBooohoo(team: any, points: number) {
    this.playSound(require('../../assets/audio/Doh.mp3'));
  }

  playSound(resource) {
    const sound = new Howl({
      src: [resource],
    });
    sound.play();
  }
}

export default observer(TTApp);
