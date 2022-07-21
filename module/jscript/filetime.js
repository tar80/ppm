(function () {
  return {
    filetimeTo: function (dwHigh, dwLow) {
      var sec = 1e-7 * (dwHigh * Math.pow(2, 32) + dwLow) - 11644473600;
      var date = new Date(0);
      date.setSeconds(sec);
      return date;
    },
    toFiletime: function (year, month, day) {
      var time = [].slice.call(arguments);
      var seconds = (function () {
        if (time.length === 4) return time;
        var hour = time[4] || 0;
        var min = time[5] || 0;
        var sec = time[6] || 0;
        var ms = time[7] || 0;
        return new Date(year, month - 1, day, hour, min, sec, ms).getTime();
      })();
      var dwHigh = (seconds * 1e-3 + 11644473600) / 1e-7 / Math.pow(2, 32);
      var dwHigh_ = Math.floor(dwHigh);
      var dwLow = (dwHigh - dwHigh_) * Math.pow(2, 32);
      return {high: dwHigh_, low: dwLow};
    }
  };
})();
