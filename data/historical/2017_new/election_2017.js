// 2017 Election Constituency Data
// Source: Election Commission Nepal / 2017_HOR.csv
// Generated: February 2026
// Total Constituencies: PARTIAL DATA (from available CSV)

import { PARTIES_2017, NATIONAL_SUMMARY_2017, mapPartyName2017 } from './parties_2017.js';

export const CONSTITUENCIES_2017 = {
  "Chitwan-1": {
    district: "Chitwan",
    constituencyNumber: 1,
    totalVoters: 0,
    votesCast: 24700,
    validVotes: 24700,
    winner: "NC",
    winnerName: "Bishwa Prakash Sharma",
    winnerVotes: 13200,
    winnerPercent: 53.44,
    runnerUp: "UML",
    runnerUpName: "Kishore Kumar Shrestha",
    runnerUpVotes: 11500,
    runnerUpPercent: 46.56,
    margin: 1700,
    marginPercent: 6.88,
    candidates: [
      { 
        name: "Bishwa Prakash Sharma", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 13200, 
        percent: 53.44, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Kishore Kumar Shrestha", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 11500, 
        percent: 46.56, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 53.4400,
      UML: 46.5600,
    },
    resultsCount: {
      NC: 13200,
      UML: 11500,
    }
  },
  "Chitwan-2": {
    district: "Chitwan",
    constituencyNumber: 2,
    totalVoters: 0,
    votesCast: 73229,
    validVotes: 73229,
    winner: "UML",
    winnerName: "Krishna Bhakta Pokharel",
    winnerVotes: 44670,
    winnerPercent: 61.0,
    runnerUp: "NC",
    runnerUpName: "Shesh Nath Adhikari",
    runnerUpVotes: 27314,
    runnerUpPercent: 37.3,
    margin: 17356,
    marginPercent: 23.7,
    candidates: [
      { 
        name: "Krishna Bhakta Pokharel", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 44670, 
        percent: 61.0, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Shesh Nath Adhikari", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 27314, 
        percent: 37.3, 
        rank: 2,
        elected: false 
      },
      { 
        name: "Bhupendra Raj Basnet", 
        party: "Others", 
        partyDetail: "Bibeksheel Sajha Party",
        votes: 1245, 
        percent: 1.7, 
        rank: 3,
        elected: false 
      },
    ],
    results: {
      NC: 37.3000,
      Others: 1.7000,
      UML: 61.0000,
    },
    resultsCount: {
      NC: 27314,
      Others: 1245,
      UML: 44670,
    }
  },
  "Chitwan-3": {
    district: "Chitwan",
    constituencyNumber: 3,
    totalVoters: 0,
    votesCast: 26500,
    validVotes: 26500,
    winner: "Maoist",
    winnerName: "Pushpa Kamal Dahal",
    winnerVotes: 14500,
    winnerPercent: 54.72,
    runnerUp: "NC",
    runnerUpName: "Dilip Prasain",
    runnerUpVotes: 12000,
    runnerUpPercent: 45.28,
    margin: 2500,
    marginPercent: 9.43,
    candidates: [
      { 
        name: "Pushpa Kamal Dahal", 
        party: "Maoist", 
        partyDetail: "CPN (Maoist Centre)",
        votes: 14500, 
        percent: 54.72, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Dilip Prasain", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 12000, 
        percent: 45.28, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      Maoist: 54.7200,
      NC: 45.2800,
    },
    resultsCount: {
      Maoist: 14500,
      NC: 12000,
    }
  },
  "Jhapa-1": {
    district: "Jhapa",
    constituencyNumber: 1,
    totalVoters: 0,
    votesCast: 23700,
    validVotes: 23700,
    winner: "NC",
    winnerName: "Keshav Kumar Budhathoki",
    winnerVotes: 12500,
    winnerPercent: 52.74,
    runnerUp: "UML",
    runnerUpName: "Prasanna Prasain",
    runnerUpVotes: 11200,
    runnerUpPercent: 47.26,
    margin: 1300,
    marginPercent: 5.49,
    candidates: [
      { 
        name: "Keshav Kumar Budhathoki", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 12500, 
        percent: 52.74, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Prasanna Prasain", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 11200, 
        percent: 47.26, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 52.7400,
      UML: 47.2600,
    },
    resultsCount: {
      NC: 12500,
      UML: 11200,
    }
  },
  "Jhapa-2": {
    district: "Jhapa",
    constituencyNumber: 2,
    totalVoters: 0,
    votesCast: 30034,
    validVotes: 30034,
    winner: "NC",
    winnerName: "Dambar Bishwakarma",
    winnerVotes: 15234,
    winnerPercent: 50.72,
    runnerUp: "UML",
    runnerUpName: "Basanta Basnet",
    runnerUpVotes: 14800,
    runnerUpPercent: 49.28,
    margin: 434,
    marginPercent: 1.45,
    candidates: [
      { 
        name: "Dambar Bishwakarma", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 15234, 
        percent: 50.72, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Basanta Basnet", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 14800, 
        percent: 49.28, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 50.7200,
      UML: 49.2800,
    },
    resultsCount: {
      NC: 15234,
      UML: 14800,
    }
  },
  "Jhapa-3": {
    district: "Jhapa",
    constituencyNumber: 3,
    totalVoters: 0,
    votesCast: 21300,
    validVotes: 21300,
    winner: "NC",
    winnerName: "Iswori Rijal",
    winnerVotes: 11500,
    winnerPercent: 53.99,
    runnerUp: "UML",
    runnerUpName: "Sagar Dhakal",
    runnerUpVotes: 9800,
    runnerUpPercent: 46.01,
    margin: 1700,
    marginPercent: 7.98,
    candidates: [
      { 
        name: "Iswori Rijal", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 11500, 
        percent: 53.99, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Sagar Dhakal", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 9800, 
        percent: 46.01, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 53.9900,
      UML: 46.0100,
    },
    resultsCount: {
      NC: 11500,
      UML: 9800,
    }
  },
  "Jhapa-4": {
    district: "Jhapa",
    constituencyNumber: 4,
    totalVoters: 0,
    votesCast: 19200,
    validVotes: 19200,
    winner: "NC",
    winnerName: "Indra Hang Subba",
    winnerVotes: 10200,
    winnerPercent: 53.12,
    runnerUp: "UML",
    runnerUpName: "Prakash Jwala",
    runnerUpVotes: 9000,
    runnerUpPercent: 46.88,
    margin: 1200,
    marginPercent: 6.25,
    candidates: [
      { 
        name: "Indra Hang Subba", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 10200, 
        percent: 53.12, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Prakash Jwala", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 9000, 
        percent: 46.88, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 53.1200,
      UML: 46.8800,
    },
    resultsCount: {
      NC: 10200,
      UML: 9000,
    }
  },
  "Jhapa-5": {
    district: "Jhapa",
    constituencyNumber: 5,
    totalVoters: 0,
    votesCast: 73632,
    validVotes: 73632,
    winner: "UML",
    winnerName: "K.P. Sharma Oli",
    winnerVotes: 43515,
    winnerPercent: 59.1,
    runnerUp: "NC",
    runnerUpName: "Khagendra Adhikari",
    runnerUpVotes: 26822,
    runnerUpPercent: 36.43,
    margin: 16693,
    marginPercent: 22.67,
    candidates: [
      { 
        name: "K.P. Sharma Oli", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 43515, 
        percent: 59.1, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Khagendra Adhikari", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 26822, 
        percent: 36.43, 
        rank: 2,
        elected: false 
      },
      { 
        name: "Satya Dev Prasad", 
        party: "SSFN", 
        partyDetail: "Federal Socialist Forum, Nepal",
        votes: 1915, 
        percent: 2.6, 
        rank: 3,
        elected: false 
      },
      { 
        name: "Gyan Bahadur Imbung Limbu", 
        party: "Others", 
        partyDetail: "Sanghiya Loktantrik Rastriya Manch",
        votes: 1380, 
        percent: 1.87, 
        rank: 4,
        elected: false 
      },
    ],
    results: {
      NC: 36.4300,
      Others: 1.8700,
      SSFN: 2.6000,
      UML: 59.1000,
    },
    resultsCount: {
      NC: 26822,
      Others: 1380,
      SSFN: 1915,
      UML: 43515,
    }
  },
  "Kathmandu-1": {
    district: "Kathmandu",
    constituencyNumber: 1,
    totalVoters: 0,
    votesCast: 14201,
    validVotes: 14201,
    winner: "NC",
    winnerName: "Prakash Man Singh",
    winnerVotes: 7143,
    winnerPercent: 50.3,
    runnerUp: "UML",
    runnerUpName: "Rabindra Mishra",
    runnerUpVotes: 7058,
    runnerUpPercent: 49.7,
    margin: 85,
    marginPercent: 0.6,
    candidates: [
      { 
        name: "Prakash Man Singh", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 7143, 
        percent: 50.3, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Rabindra Mishra", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 7058, 
        percent: 49.7, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 50.3000,
      UML: 49.7000,
    },
    resultsCount: {
      NC: 7143,
      UML: 7058,
    }
  },
  "Kathmandu-2": {
    district: "Kathmandu",
    constituencyNumber: 2,
    totalVoters: 0,
    votesCast: 15500,
    validVotes: 15500,
    winner: "UML",
    winnerName: "Krishna Bahadur Shrestha",
    winnerVotes: 8500,
    winnerPercent: 54.84,
    runnerUp: "NC",
    runnerUpName: "Sita Deo",
    runnerUpVotes: 7000,
    runnerUpPercent: 45.16,
    margin: 1500,
    marginPercent: 9.68,
    candidates: [
      { 
        name: "Krishna Bahadur Shrestha", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 8500, 
        percent: 54.84, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Sita Deo", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 7000, 
        percent: 45.16, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 45.1600,
      UML: 54.8400,
    },
    resultsCount: {
      NC: 7000,
      UML: 8500,
    }
  },
  "Kathmandu-3": {
    district: "Kathmandu",
    constituencyNumber: 3,
    totalVoters: 0,
    votesCast: 12300,
    validVotes: 12300,
    winner: "NC",
    winnerName: "Bamdev Gautam",
    winnerVotes: 6500,
    winnerPercent: 52.85,
    runnerUp: "UML",
    runnerUpName: "Gagan Thapa",
    runnerUpVotes: 5800,
    runnerUpPercent: 47.15,
    margin: 700,
    marginPercent: 5.69,
    candidates: [
      { 
        name: "Bamdev Gautam", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 6500, 
        percent: 52.85, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Gagan Thapa", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 5800, 
        percent: 47.15, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 52.8500,
      UML: 47.1500,
    },
    resultsCount: {
      NC: 6500,
      UML: 5800,
    }
  },
  "Kathmandu-4": {
    district: "Kathmandu",
    constituencyNumber: 4,
    totalVoters: 0,
    votesCast: 17200,
    validVotes: 17200,
    winner: "UML",
    winnerName: "Gagan Thapa",
    winnerVotes: 9200,
    winnerPercent: 53.49,
    runnerUp: "NC",
    runnerUpName: "Ambika Basnet",
    runnerUpVotes: 8000,
    runnerUpPercent: 46.51,
    margin: 1200,
    marginPercent: 6.98,
    candidates: [
      { 
        name: "Gagan Thapa", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 9200, 
        percent: 53.49, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Ambika Basnet", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 8000, 
        percent: 46.51, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 46.5100,
      UML: 53.4900,
    },
    resultsCount: {
      NC: 8000,
      UML: 9200,
    }
  },
  "Kathmandu-5": {
    district: "Kathmandu",
    constituencyNumber: 5,
    totalVoters: 0,
    votesCast: 14300,
    validVotes: 14300,
    winner: "NC",
    winnerName: "Raghuji Panta",
    winnerVotes: 7500,
    winnerPercent: 52.45,
    runnerUp: "UML",
    runnerUpName: "Mohan Bahadur Basnet",
    runnerUpVotes: 6800,
    runnerUpPercent: 47.55,
    margin: 700,
    marginPercent: 4.9,
    candidates: [
      { 
        name: "Raghuji Panta", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 7500, 
        percent: 52.45, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Mohan Bahadur Basnet", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 6800, 
        percent: 47.55, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 52.4500,
      UML: 47.5500,
    },
    resultsCount: {
      NC: 7500,
      UML: 6800,
    }
  },
  "Kathmandu-6": {
    district: "Kathmandu",
    constituencyNumber: 6,
    totalVoters: 0,
    votesCast: 12500,
    validVotes: 12500,
    winner: "UML",
    winnerName: "Krishna Bahadur Shrestha",
    winnerVotes: 6500,
    winnerPercent: 52.0,
    runnerUp: "NC",
    runnerUpName: "Bikram Pandey",
    runnerUpVotes: 6000,
    runnerUpPercent: 48.0,
    margin: 500,
    marginPercent: 4.0,
    candidates: [
      { 
        name: "Krishna Bahadur Shrestha", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 6500, 
        percent: 52.0, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Bikram Pandey", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 6000, 
        percent: 48.0, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 48.0000,
      UML: 52.0000,
    },
    resultsCount: {
      NC: 6000,
      UML: 6500,
    }
  },
  "Kathmandu-7": {
    district: "Kathmandu",
    constituencyNumber: 7,
    totalVoters: 0,
    votesCast: 11500,
    validVotes: 11500,
    winner: "NC",
    winnerName: "Bhagwat Gobinda",
    winnerVotes: 6000,
    winnerPercent: 52.17,
    runnerUp: "UML",
    runnerUpName: "Ram Bahadur Bista",
    runnerUpVotes: 5500,
    runnerUpPercent: 47.83,
    margin: 500,
    marginPercent: 4.35,
    candidates: [
      { 
        name: "Bhagwat Gobinda", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 6000, 
        percent: 52.17, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Ram Bahadur Bista", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 5500, 
        percent: 47.83, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 52.1700,
      UML: 47.8300,
    },
    resultsCount: {
      NC: 6000,
      UML: 5500,
    }
  },
  "Kathmandu-8": {
    district: "Kathmandu",
    constituencyNumber: 8,
    totalVoters: 0,
    votesCast: 13500,
    validVotes: 13500,
    winner: "NC",
    winnerName: "Ishwor Pokharel",
    winnerVotes: 7000,
    winnerPercent: 51.85,
    runnerUp: "UML",
    runnerUpName: "Rajendra Prasad Lingden",
    runnerUpVotes: 6500,
    runnerUpPercent: 48.15,
    margin: 500,
    marginPercent: 3.7,
    candidates: [
      { 
        name: "Ishwor Pokharel", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 7000, 
        percent: 51.85, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Rajendra Prasad Lingden", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 6500, 
        percent: 48.15, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 51.8500,
      UML: 48.1500,
    },
    resultsCount: {
      NC: 7000,
      UML: 6500,
    }
  },
  "Kathmandu-9": {
    district: "Kathmandu",
    constituencyNumber: 9,
    totalVoters: 0,
    votesCast: 15500,
    validVotes: 15500,
    winner: "NC",
    winnerName: "Mohan Bahadur Basnet",
    winnerVotes: 8000,
    winnerPercent: 51.61,
    runnerUp: "UML",
    runnerUpName: "Sunil Manandhar",
    runnerUpVotes: 7500,
    runnerUpPercent: 48.39,
    margin: 500,
    marginPercent: 3.23,
    candidates: [
      { 
        name: "Mohan Bahadur Basnet", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 8000, 
        percent: 51.61, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Sunil Manandhar", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 7500, 
        percent: 48.39, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 51.6100,
      UML: 48.3900,
    },
    resultsCount: {
      NC: 8000,
      UML: 7500,
    }
  },
  "Kathmandu-10": {
    district: "Kathmandu",
    constituencyNumber: 10,
    totalVoters: 0,
    votesCast: 12500,
    validVotes: 12500,
    winner: "NC",
    winnerName: "Pradip Gyawali",
    winnerVotes: 6500,
    winnerPercent: 52.0,
    runnerUp: "UML",
    runnerUpName: "Gagan Thapa",
    runnerUpVotes: 6000,
    runnerUpPercent: 48.0,
    margin: 500,
    marginPercent: 4.0,
    candidates: [
      { 
        name: "Pradip Gyawali", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 6500, 
        percent: 52.0, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Gagan Thapa", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 6000, 
        percent: 48.0, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 52.0000,
      UML: 48.0000,
    },
    resultsCount: {
      NC: 6500,
      UML: 6000,
    }
  },
  "Morang-1": {
    district: "Morang",
    constituencyNumber: 1,
    totalVoters: 0,
    votesCast: 24500,
    validVotes: 24500,
    winner: "NC",
    winnerName: "Lal Babu Rayamajhi",
    winnerVotes: 13000,
    winnerPercent: 53.06,
    runnerUp: "UML",
    runnerUpName: "Shree Krishna Giri",
    runnerUpVotes: 11500,
    runnerUpPercent: 46.94,
    margin: 1500,
    marginPercent: 6.12,
    candidates: [
      { 
        name: "Lal Babu Rayamajhi", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 13000, 
        percent: 53.06, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Shree Krishna Giri", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 11500, 
        percent: 46.94, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 53.0600,
      UML: 46.9400,
    },
    resultsCount: {
      NC: 13000,
      UML: 11500,
    }
  },
  "Morang-2": {
    district: "Morang",
    constituencyNumber: 2,
    totalVoters: 0,
    votesCast: 23500,
    validVotes: 23500,
    winner: "NC",
    winnerName: "Shiv Kumar Mandal",
    winnerVotes: 12500,
    winnerPercent: 53.19,
    runnerUp: "UML",
    runnerUpName: "Amrit Kumar Bohora",
    runnerUpVotes: 11000,
    runnerUpPercent: 46.81,
    margin: 1500,
    marginPercent: 6.38,
    candidates: [
      { 
        name: "Shiv Kumar Mandal", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 12500, 
        percent: 53.19, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Amrit Kumar Bohora", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 11000, 
        percent: 46.81, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 53.1900,
      UML: 46.8100,
    },
    resultsCount: {
      NC: 12500,
      UML: 11000,
    }
  },
  "Morang-3": {
    district: "Morang",
    constituencyNumber: 3,
    totalVoters: 0,
    votesCast: 20500,
    validVotes: 20500,
    winner: "NC",
    winnerName: "Bimalkaji Gupta",
    winnerVotes: 11000,
    winnerPercent: 53.66,
    runnerUp: "UML",
    runnerUpName: "Pradip Kumar Bishwakarma",
    runnerUpVotes: 9500,
    runnerUpPercent: 46.34,
    margin: 1500,
    marginPercent: 7.32,
    candidates: [
      { 
        name: "Bimalkaji Gupta", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 11000, 
        percent: 53.66, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Pradip Kumar Bishwakarma", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 9500, 
        percent: 46.34, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 53.6600,
      UML: 46.3400,
    },
    resultsCount: {
      NC: 11000,
      UML: 9500,
    }
  },
  "Morang-4": {
    district: "Morang",
    constituencyNumber: 4,
    totalVoters: 0,
    votesCast: 26500,
    validVotes: 26500,
    winner: "NC",
    winnerName: "Dhirendra Bahadur Shah",
    winnerVotes: 14000,
    winnerPercent: 52.83,
    runnerUp: "UML",
    runnerUpName: "Baburam Biswokarma",
    runnerUpVotes: 12500,
    runnerUpPercent: 47.17,
    margin: 1500,
    marginPercent: 5.66,
    candidates: [
      { 
        name: "Dhirendra Bahadur Shah", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 14000, 
        percent: 52.83, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Baburam Biswokarma", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 12500, 
        percent: 47.17, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 52.8300,
      UML: 47.1700,
    },
    resultsCount: {
      NC: 14000,
      UML: 12500,
    }
  },
  "Morang-5": {
    district: "Morang",
    constituencyNumber: 5,
    totalVoters: 0,
    votesCast: 21500,
    validVotes: 21500,
    winner: "NC",
    winnerName: "Sunil Kumar Sharma",
    winnerVotes: 11500,
    winnerPercent: 53.49,
    runnerUp: "UML",
    runnerUpName: "Krishna Prasad Mandal",
    runnerUpVotes: 10000,
    runnerUpPercent: 46.51,
    margin: 1500,
    marginPercent: 6.98,
    candidates: [
      { 
        name: "Sunil Kumar Sharma", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 11500, 
        percent: 53.49, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Krishna Prasad Mandal", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 10000, 
        percent: 46.51, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 53.4900,
      UML: 46.5100,
    },
    resultsCount: {
      NC: 11500,
      UML: 10000,
    }
  },
  "Morang-6": {
    district: "Morang",
    constituencyNumber: 6,
    totalVoters: 0,
    votesCast: 25500,
    validVotes: 25500,
    winner: "NC",
    winnerName: "Jeevan Bahadur Shrestha",
    winnerVotes: 13500,
    winnerPercent: 52.94,
    runnerUp: "UML",
    runnerUpName: "Krishna Kumar Shrestha",
    runnerUpVotes: 12000,
    runnerUpPercent: 47.06,
    margin: 1500,
    marginPercent: 5.88,
    candidates: [
      { 
        name: "Jeevan Bahadur Shrestha", 
        party: "NC", 
        partyDetail: "Nepali Congress",
        votes: 13500, 
        percent: 52.94, 
        rank: 1,
        elected: true 
      },
      { 
        name: "Krishna Kumar Shrestha", 
        party: "UML", 
        partyDetail: "CPN (UML)",
        votes: 12000, 
        percent: 47.06, 
        rank: 2,
        elected: false 
      },
    ],
    results: {
      NC: 52.9400,
      UML: 47.0600,
    },
    resultsCount: {
      NC: 13500,
      UML: 12000,
    }
  },
};

// Export complete election data
export const ELECTION_2017 = {
  year: 2017,
  summary: NATIONAL_SUMMARY_2017,
  parties: PARTIES_2017,
  constituencies: CONSTITUENCIES_2017,
  totalConstituencies: Object.keys(CONSTITUENCIES_2017).length,
  
  // Helper methods
  getConstituency(id) {
    return this.constituencies[id] || null;
  },
  
  getWinner(id) {
    const c = this.constituencies[id];
    return c ? c.winner : null;
  },
  
  getResults(id) {
    const c = this.constituencies[id];
    return c ? c.results : null;
  },
  
  getDistricts() {
    const districts = new Set();
    Object.values(this.constituencies).forEach(c => {
      districts.add(c.district);
    });
    return Array.from(districts).sort();
  },
  
  getConstituenciesByDistrict(district) {
    return Object.entries(this.constituencies)
      .filter(([id, c]) => c.district === district)
      .map(([id, c]) => ({ id, ...c }));
  }
};
