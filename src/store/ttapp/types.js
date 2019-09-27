/* @flow */

export type Club = {
  clubname: string,
  regionname: string,
};

export type Team = {
  pouleid: number,
  poulename: string,
  teamid: number,
  teamname: string,
  players: Array<string>,
};

export type Semester = {
  semesterid: number,
  semestername: string,
};

export type Group = {
  groupid: string,
  groupname: string,
  teams: Array<Team>,
};

export type Match = {
  id: number,
  pouleid: number,
  team1id: number,
  team1name: string,
  team2id: number,
  team2name: string,
  score1: number | void,
  score2: number | void,
  playdate: string,
  playtime: string,
};

export type Poule = {
  pouleid: number,
  poulename: string,
  groupid: number,
  groupname: string,
  regionname: string,
  seasonname: string,
  semester: number,
  matches: Array<Match>,
};
