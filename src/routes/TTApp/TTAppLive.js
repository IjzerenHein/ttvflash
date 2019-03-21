/* @flow */
import React, { Component } from 'react';
import { observer, ttapp } from '../../store';
import Clock from 'react-live-clock';
import moment from 'moment';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: 'green',
    width: 481,
  },
  header: {
    backgroundColor: '#f8f8f8',
    borderBottom: '1px solid #e7e7e7',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    height: '120px',
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
    padding: '16px',
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
    padding: '10px 0',
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
    height: '40px',
  },
  left: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  body: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 20,
  },
  caption: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 18,
    color: 'gray',
  },
  heading1: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 50,
    fontWeight: 'bold',
  },
  heading2: {
    fontFamily: "'PT Sans', sans-serif",
    fontSize: 30,
    fontWeight: 'bold',
  },
};

interface PropsType {}

export const TTAppLive = observer(
  class TTAppLive extends Component<PropsType> {
    render() {
      const { todaysTeams, lastUpdated } = ttapp;
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.heading2}>{`Wedstrijden vandaag`}</div>
              <div style={styles.caption}>{moment().format('dddd D MMMM')}</div>
            </div>
            <Clock ticking={true} style={styles.heading1} />
          </div>
          {todaysTeams.length ? (
            <div style={styles.matches}>
              {todaysTeams.map(team => {
                const match = team.todaysMatch;
                return (
                  <div style={styles.matchContainer} key={team.teamId}>
                    <div style={styles.left}>
                      <div style={styles.body}>
                        {`${match.team1name} - ${match.team2name}`}
                      </div>
                      <div style={styles.caption}>{`${team.pouleName}`}</div>
                    </div>
                    <div style={styles.heading2}>{`${match.result}`}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.noMatches}>
              <div style={styles.body}>{`Er worden vandaag geen`}</div>
              <div style={styles.body}>{`NTTB wedstrijden gespeeld`}</div>
            </div>
          )}
          <div style={styles.footer}>
            <div style={styles.footerLeft}>
              <div
                style={styles.body}
              >{`Powered by TTApp, by @ijzerenhein`}</div>
              <div style={styles.caption}>{`Laatst bijgewerkt ${
                lastUpdated ? moment(lastUpdated).format('HH:MM') : ''
              }`}</div>
            </div>
            <img
              src={require('../../assets/ttapp.png')}
              height={64}
              alt="ttapp-logo"
            />
          </div>
        </div>
      );
    }
  },
);
