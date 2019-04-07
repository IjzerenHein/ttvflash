/* @flow */
import React, { Component } from 'react';
import { observer, TTAppStore } from '../../store';
import 'moment/locale/nl';
import { Howl } from 'howler';
import type { TTAppEvent } from '../../store';
import Confetti from 'react-confetti';

const Colors = {
  red: '#a90201',
  lightGray: '#f8f8f8',
  gray: '#e7e7e7',
};

const styles = {
  container: {
    position: 'absolute',
    backgroundColor: '#FFFFFFd0',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  confetti: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  heading1: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading2: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.red,
  },
};

interface PropsType {
  store: TTAppStore;
  delay: number;
}

interface StateType {
  event: ?TTAppEvent;
}

export const TTAppOverlay = observer(
  class TTAppOverlay extends Component<PropsType, StateType> {
    _timer: any;

    state = {
      event: undefined,
    };

    componentDidMount() {
      /*const event = {
        type: 'matchUpdated',
        team: {
          teamId: 1,
        },
        match: {
          team1name: 'Flash 1',
          team1id: 1,
          team2name: 'Meppers 1',
          team2id: 3,
          score1: 4,
          score2: 2,
        },
        scoredTeamId: 1,
        scoredTeamName: 'Flash 1',
      };
      this.props.store.eventStream.push(event);*/

      this._timer = setInterval(() => {
        const event = this.props.store.eventStream.pop();
        if (!event) {
          this.setState({ event });
        } else if (event.type === 'matchUpdated') {
          this.onEvent(event);
          this.setState({ event });
        }
      }, 15000);
    }

    componentWillUnmount() {
      clearInterval(this._timer);
      this._timer = undefined;
    }

    render() {
      const { event } = this.state;
      if (!event) return null;
      const { match, team, scoredTeamId, scoredTeamName } = event;
      const isWin = scoredTeamId === team.teamId;

      return (
        <div style={styles.container}>
          {isWin ? (
            <div style={styles.confetti}>
              <Confetti />
            </div>
          ) : (
            undefined
          )}
          <div style={styles.heading1}>{`${scoredTeamName ||
            ''} heeft gescoord`}</div>
          <div style={styles.heading2}>
            {`${match.team1name} - ${match.team2name} (${match.score1} - ${
              match.score2
            })`}
          </div>
        </div>
      );
    }

    onEvent(event) {
      console.log('onEvent: ', event.type, ', team: ', event.team.teamName);
      switch (event.type) {
        case 'matchUpdated':
          if (event.scoredTeamId === event.team.teamId) {
            this.onHooray(event.team, event.match);
          } else {
            this.onBooohoo(event.team, event.match);
          }
          break;
        default:
          break;
      }
    }

    matchToText(match: any) {
      return `${match.team1name} versus ${match.team2name}, ${match.score1}, ${
        match.score2
      }`;
    }

    async onHooray(team: any, match: any) {
      await this.playSound(
        // $FlowFixMe
        require('../../assets/audio/alweer-een-winnaar.mp3'),
      );
      // TextToSpeech.talk(this.matchToText(match));
    }

    async onBooohoo(team: any, match: any) {
      // $FlowFixMe
      await this.playSound(require('../../assets/audio/Doh.mp3'));
      // TextToSpeech.talk(this.matchToText(match));
    }

    playSound(resource) {
      return new Promise(resolve => {
        const sound = new Howl({
          src: [resource],
        });
        sound.play();
        sound.on('end', () => {
          resolve(true);
        });
      });
    }
  },
);
