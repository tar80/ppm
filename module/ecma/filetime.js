﻿(() => {
  'use strict';
  return {
    toTime: (dwHigh, dwLow) => {
      const sec = 1e-7 * (dwHigh * Math.pow(2, 32) + dwLow) - 11644473600;
      const date = new Date(0);
      date.setSeconds(sec);
      return date;
    },
    fromTime: (year, month, day, ...time) => {
      const sec = month === undefined ? year : new Date(year, month - 1, day, ...time).getTime();
      const dwHigh = (sec * 1e-3 + 11644473600) / 1e-7 / Math.pow(2, 32);
      const dwHigh_ = Math.floor(dwHigh);
      const dwLow = (dwHigh - dwHigh_) * Math.pow(2, 32);
      return {high: dwHigh_, low: dwLow};
    }
  };
})();
