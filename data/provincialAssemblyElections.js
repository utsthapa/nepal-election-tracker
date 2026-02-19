// Provincial Assembly election data for Nepal
// Seven provinces with their assembly elections

export const PROVINCIAL_ASSEMBLY_ELECTIONS = {
  2022: {
    year: 2022,
    date: 'November 20, 2022',
    provinces: {
      Koshi: {
        totalSeats: 93,
        fptpSeats: 56,
        prSeats: 37,
        turnout: '65.2%',
        results: {
          FPTP: { NC: 24, UML: 21, Maoist: 7, RSP: 3, RPP: 1 },
          PR: { NC: 15, UML: 13, Maoist: 5, RSP: 3, RPP: 1 },
          Total: { NC: 39, UML: 34, Maoist: 12, RSP: 6, RPP: 2 },
        },
        government: 'UML-led coalition',
      },
      Madhesh: {
        totalSeats: 107,
        fptpSeats: 64,
        prSeats: 43,
        turnout: '58.4%',
        results: {
          FPTP: { JSPN: 18, NC: 15, UML: 10, JP: 8, Maoist: 7, LSP: 5, RSP: 1 },
          PR: { JSPN: 12, NC: 10, UML: 7, JP: 5, Maoist: 5, LSP: 3, RSP: 1 },
          Total: { JSPN: 30, NC: 25, UML: 17, JP: 13, Maoist: 12, LSP: 8, RSP: 2 },
        },
        government: 'JSPN-NC coalition',
      },
      Bagmati: {
        totalSeats: 110,
        fptpSeats: 66,
        prSeats: 44,
        turnout: '68.9%',
        results: {
          FPTP: { NC: 28, UML: 22, RSP: 8, Maoist: 5, RPP: 2, US: 1 },
          PR: { NC: 18, UML: 15, RSP: 5, Maoist: 3, RPP: 2, US: 1 },
          Total: { NC: 46, UML: 37, RSP: 13, Maoist: 8, RPP: 4, US: 2 },
        },
        government: 'NC-led coalition',
      },
      Gandaki: {
        totalSeats: 60,
        fptpSeats: 36,
        prSeats: 24,
        turnout: '66.3%',
        results: {
          FPTP: { NC: 18, UML: 12, Maoist: 4, RSP: 2 },
          PR: { NC: 12, UML: 8, Maoist: 3, RSP: 1 },
          Total: { NC: 30, UML: 20, Maoist: 7, RSP: 3 },
        },
        government: 'NC-led coalition',
      },
      Lumbini: {
        totalSeats: 87,
        fptpSeats: 52,
        prSeats: 35,
        turnout: '62.7%',
        results: {
          FPTP: { UML: 25, NC: 18, Maoist: 6, RPP: 2, JSPN: 1 },
          PR: { UML: 17, NC: 12, Maoist: 4, RPP: 2, JSPN: 0 },
          Total: { UML: 42, NC: 30, Maoist: 10, RPP: 4, JSPN: 1 },
        },
        government: 'UML-led coalition',
      },
      Karnali: {
        totalSeats: 40,
        fptpSeats: 24,
        prSeats: 16,
        turnout: '59.8%',
        results: {
          FPTP: { NC: 11, UML: 9, Maoist: 4 },
          PR: { NC: 7, UML: 6, Maoist: 3 },
          Total: { NC: 18, UML: 15, Maoist: 7 },
        },
        government: 'NC-led coalition',
      },
      Sudurpashchim: {
        totalSeats: 53,
        fptpSeats: 32,
        prSeats: 21,
        turnout: '61.5%',
        results: {
          FPTP: { NC: 15, UML: 11, Maoist: 4, NUP: 2 },
          PR: { NC: 10, UML: 7, Maoist: 3, NUP: 1 },
          Total: { NC: 25, UML: 18, Maoist: 7, NUP: 3 },
        },
        government: 'NC-led coalition',
      },
    },
  },
  2017: {
    year: 2017,
    date: 'November 26 & December 7, 2017',
    provinces: {
      Koshi: {
        totalSeats: 93,
        fptpSeats: 56,
        prSeats: 37,
        turnout: '72.1%',
        results: {
          FPTP: { UML: 34, NC: 16, Maoist: 6 },
          PR: { UML: 22, NC: 11, Maoist: 4 },
          Total: { UML: 56, NC: 27, Maoist: 10 },
        },
        government: 'UML-led',
      },
      Madhesh: {
        totalSeats: 107,
        fptpSeats: 64,
        prSeats: 43,
        turnout: '68.5%',
        results: {
          FPTP: { RJPN: 25, FSFN: 16, NC: 12, UML: 8, Maoist: 3 },
          PR: { RJPN: 17, FSFN: 11, NC: 8, UML: 5, Maoist: 2 },
          Total: { RJPN: 42, FSFN: 27, NC: 20, UML: 13, Maoist: 5 },
        },
        government: 'RJPN-FSFN coalition',
      },
      Bagmati: {
        totalSeats: 110,
        fptpSeats: 66,
        prSeats: 44,
        turnout: '75.3%',
        results: {
          FPTP: { UML: 41, NC: 21, Maoist: 4 },
          PR: { UML: 27, NC: 14, Maoist: 3 },
          Total: { UML: 68, NC: 35, Maoist: 7 },
        },
        government: 'UML-led',
      },
      Gandaki: {
        totalSeats: 60,
        fptpSeats: 36,
        prSeats: 24,
        turnout: '73.8%',
        results: {
          FPTP: { UML: 22, NC: 12, Maoist: 2 },
          PR: { UML: 15, NC: 8, Maoist: 1 },
          Total: { UML: 37, NC: 20, Maoist: 3 },
        },
        government: 'UML-led',
      },
      Lumbini: {
        totalSeats: 87,
        fptpSeats: 52,
        prSeats: 35,
        turnout: '70.2%',
        results: {
          FPTP: { UML: 31, NC: 15, Maoist: 4, FSFN: 2 },
          PR: { UML: 21, NC: 10, Maoist: 3, FSFN: 1 },
          Total: { UML: 52, NC: 25, Maoist: 7, FSFN: 3 },
        },
        government: 'UML-led',
      },
      Karnali: {
        totalSeats: 40,
        fptpSeats: 24,
        prSeats: 16,
        turnout: '67.4%',
        results: {
          FPTP: { UML: 13, NC: 8, Maoist: 3 },
          PR: { UML: 9, NC: 5, Maoist: 2 },
          Total: { UML: 22, NC: 13, Maoist: 5 },
        },
        government: 'UML-led',
      },
      Sudurpashchim: {
        totalSeats: 53,
        fptpSeats: 32,
        prSeats: 21,
        turnout: '69.1%',
        results: {
          FPTP: { UML: 17, NC: 12, Maoist: 3 },
          PR: { UML: 11, NC: 8, Maoist: 2 },
          Total: { UML: 28, NC: 20, Maoist: 5 },
        },
        government: 'UML-led',
      },
    },
  },
};

export default PROVINCIAL_ASSEMBLY_ELECTIONS;
