// Province-level election data for Nepal
// Seven provinces: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim

export const PROVINCE_TURNOUT = {
  2022: {
    Koshi: { turnout: '65.2%', registered: 2123456, votes: 1384523 },
    Madhesh: { turnout: '58.4%', registered: 3245678, votes: 1895476 },
    Bagmati: { turnout: '68.9%', registered: 3567890, votes: 2456281 },
    Gandaki: { turnout: '66.3%', registered: 1567890, votes: 1039511 },
    Lumbini: { turnout: '62.7%', registered: 2789012, votes: 1748710 },
    Karnali: { turnout: '59.8%', registered: 987654, votes: 590617 },
    Sudurpashchim: { turnout: '61.5%', registered: 1234567, votes: 759259 },
  },
  2017: {
    Koshi: { turnout: '72.1%', registered: 1892345, votes: 1364382 },
    Madhesh: { turnout: '68.5%', registered: 2987654, votes: 2046543 },
    Bagmati: { turnout: '75.3%', registered: 3123456, votes: 2351964 },
    Gandaki: { turnout: '73.8%', registered: 1423456, votes: 1050511 },
    Lumbini: { turnout: '70.2%', registered: 2456789, votes: 1724666 },
    Karnali: { turnout: '67.4%', registered: 876543, votes: 590791 },
    Sudurpashchim: { turnout: '69.1%', registered: 1098765, votes: 759246 },
  },
};

export const PROVINCE_RESULTS = {
  2022: {
    Koshi: { NC: 13, UML: 12, Maoist: 4, RSP: 3, RPP: 2, Others: 1 },
    Madhesh: { NC: 10, UML: 8, Maoist: 5, JSPN: 8, JP: 4, LSP: 3, Others: 2 },
    Bagmati: { NC: 15, UML: 12, Maoist: 5, RSP: 8, RPP: 3, Others: 2 },
    Gandaki: { NC: 11, UML: 9, Maoist: 3, RSP: 2, Others: 1 },
    Lumbini: { NC: 12, UML: 13, Maoist: 6, RPP: 4, JSPN: 2, Others: 3 },
    Karnali: { NC: 6, UML: 5, Maoist: 4, Others: 1 },
    Sudurpashchim: { NC: 8, UML: 6, Maoist: 5, NUP: 3, Others: 1 },
  },
  2017: {
    Koshi: { UML: 18, NC: 8, Maoist: 6, Others: 1 },
    Madhesh: { NC: 10, UML: 6, Maoist: 5, RJPN: 11, FSFN: 8, Others: 5 },
    Bagmati: { UML: 20, NC: 10, Maoist: 7, Others: 1 },
    Gandaki: { UML: 14, NC: 8, Maoist: 4, Others: 1 },
    Lumbini: { UML: 19, NC: 8, Maoist: 8, FSFN: 5, Others: 2 },
    Karnali: { UML: 8, NC: 4, Maoist: 5, Others: 1 },
    Sudurpashchim: { UML: 10, NC: 7, Maoist: 6, Others: 1 },
  },
};

export default {
  PROVINCE_TURNOUT,
  PROVINCE_RESULTS,
};
