// Local election data for Nepal
// Covers 2017 and 2022 local elections (municipalities and rural municipalities)
// Source: Election Commission of Nepal — https://election.gov.np/

export const LOCAL_ELECTIONS = {
  2022: {
    year: 2022,
    date: 'May 13, 2022',
    type: 'Local Level Election',
    totalLocalBodies: 753, // 293 Municipalities + 460 Rural Municipalities
    totalWards: 6743,
    turnout: '64.0%',
    summary: {
      mayors: {
        NC: 329,
        UML: 206,
        Maoist: 121,
        RSP: 26,
        JSPN: 28,
        RPP: 4,
        US: 9,
        LSP: 11,
        JP: 3,
        NUP: 2,
        Others: 14,
      },
      deputyMayors: {
        NC: 301,
        UML: 193,
        Maoist: 116,
        RSP: 24,
        JSPN: 35,
        RPP: 6,
        US: 11,
        LSP: 14,
        JP: 4,
        NUP: 3,
        Others: 46,
      },
    },
    provinceBreakdown: {
      Koshi: { NC: 50, UML: 38, Maoist: 15, RSP: 4, Others: 3 },
      Madhesh: { NC: 58, UML: 32, JSPN: 23, Maoist: 12, JP: 8, LSP: 6, Others: 5 },
      Bagmati: { NC: 62, UML: 45, Maoist: 18, RSP: 12, Others: 4 },
      Gandaki: { NC: 38, UML: 28, Maoist: 10, RSP: 3, Others: 2 },
      Lumbini: { NC: 55, UML: 42, Maoist: 20, RPP: 3, Others: 5 },
      Karnali: { NC: 32, UML: 15, Maoist: 18, Others: 2 },
      Sudurpashchim: { NC: 34, UML: 16, Maoist: 8, NUP: 2, Others: 3 },
    },
  },
  2017: {
    year: 2017,
    date: 'May 14, June 28, September 18, 2017',
    type: 'Local Level Election',
    totalLocalBodies: 753,
    totalWards: 6743,
    turnout: '71.0%',
    summary: {
      mayors: {
        NC: 266,
        UML: 294,
        Maoist: 111,
        RJPN: 25,
        FSFN: 24,
        RPP: 5,
        NSP: 3,
        Others: 25,
      },
      deputyMayors: {
        NC: 249,
        UML: 277,
        Maoist: 106,
        RJPN: 32,
        FSFN: 28,
        RPP: 8,
        NSP: 5,
        Others: 48,
      },
    },
    provinceBreakdown: {
      Koshi: { UML: 62, NC: 35, Maoist: 13, Others: 2 },
      Madhesh: { NC: 48, UML: 32, RJPN: 25, FSFN: 24, Maoist: 8, Others: 5 },
      Bagmati: { UML: 67, NC: 42, Maoist: 14, Others: 3 },
      Gandaki: { UML: 38, NC: 28, Maoist: 8, Others: 1 },
      Lumbini: { UML: 58, NC: 35, Maoist: 16, FSFN: 5, Others: 4 },
      Karnali: { NC: 28, UML: 18, Maoist: 21, Others: 1 },
      Sudurpashchim: { NC: 26, UML: 19, Maoist: 11, Others: 2 },
    },
  },
};

// Key metropolitan cities results — winner and party sourced from Election Commission of Nepal
export const METROPOLITAN_RESULTS = {
  2022: {
    Kathmandu: {
      mayor: 'Balendra Shah',
      party: 'RSP',
      runnerUp: 'Keshav Sthapit',
      runnerUpParty: 'UML',
    },
    Pokhara: {
      mayor: 'Dhanraj Acharya',
      party: 'NC',
      runnerUp: 'Krishna Thapa',
      runnerUpParty: 'UML',
    },
    Lalitpur: {
      mayor: 'Chiri Babu Maharjan',
      party: 'NC',
      runnerUp: 'Hari Krishna Byanjankar',
      runnerUpParty: 'UML',
    },
    Bharatpur: {
      mayor: 'Renu Dahal',
      party: 'Maoist',
      runnerUp: 'Bijay Subedi',
      runnerUpParty: 'UML',
    },
    Birgunj: {
      mayor: 'Rajesh Man Singh',
      party: 'NC',
      runnerUp: 'Vijay Kumar Sarawagi',
      runnerUpParty: 'JSPN',
    },
    Biratnagar: {
      mayor: 'Nagesh Koirala',
      party: 'NC',
      runnerUp: 'Sagar Kumar Thapa',
      runnerUpParty: 'UML',
    },
  },
  2017: {
    Kathmandu: {
      mayor: 'Bidya Sundar Shakya',
      party: 'UML',
      runnerUp: 'Rajaram Shrestha',
      runnerUpParty: 'NC',
    },
    Pokhara: {
      mayor: 'Man Bahadur GC',
      party: 'UML',
      runnerUp: 'Krishna Thapa',
      runnerUpParty: 'NC',
    },
    Lalitpur: {
      mayor: 'Chiri Babu Maharjan',
      party: 'NC',
      runnerUp: 'Hari Krishna Byanjankar',
      runnerUpParty: 'UML',
    },
    Bharatpur: {
      mayor: 'Renu Dahal',
      party: 'Maoist',
      runnerUp: 'Devi Gyawali',
      runnerUpParty: 'UML',
    },
    Birgunj: {
      mayor: 'Vijay Kumar Sarawagi',
      party: 'RJPN',
      runnerUp: 'Rajesh Man Singh',
      runnerUpParty: 'NC',
    },
    Biratnagar: {
      mayor: 'Bhima Parajuli',
      party: 'NC',
      runnerUp: 'Nagesh Koirala',
      runnerUpParty: 'UML',
    },
  },
};

export default {
  LOCAL_ELECTIONS,
  METROPOLITAN_RESULTS,
};
