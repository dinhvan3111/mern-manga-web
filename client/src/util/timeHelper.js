const dateToTs = (date) => {
  const ts = Math.floor(new Date(date).getTime());
  return ts;
};

const calculateDateDistance = (date1, date2) => {
  var difference = Math.abs(date2 - date1);
  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  var weeksDifference = Math.floor(daysDifference / 7);
  var monthsDifference = Math.floor(daysDifference / 31);
  var yearsDifference = Math.floor(monthsDifference / 12);
  difference -= daysDifference * 1000 * 60 * 60 * 24;
  var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;
  var minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;
  var secondsDifference = Math.floor(difference / 1000);
  return {
    yearsDifference,
    monthsDifference,
    weeksDifference,
    daysDifference,
    hoursDifference,
    minutesDifference,
    secondsDifference,
  };
};

const getDateDiff = (date) => {
  const diff = calculateDateDistance(date, Date.now());
  if (diff.yearsDifference > 0)
    return `${
      diff.yearsDifference <= 1
        ? `${diff.yearsDifference} day ago`
        : `${diff.yearsDifference} days ago`
    }`;
  if (diff.monthsDifference > 0)
    return `${
      diff.monthsDifference <= 1
        ? `${diff.monthsDifference} month ago`
        : `${diff.monthsDifference} months ago`
    }`;
  if (diff.daysDifference > 0)
    return `${
      diff.daysDifference <= 1
        ? `${diff.daysDifference} day ago`
        : `${diff.daysDifference} days ago`
    }`;
  if (diff.hoursDifference > 0)
    return `${
      diff.hoursDifference <= 1
        ? `${diff.hoursDifference} hour ago`
        : `${diff.hoursDifference} hours ago`
    }`;
  if (diff.minutesDifference > 0)
    return `${
      diff.minutesDifference <= 1
        ? `${diff.minutesDifference} minute ago`
        : `${diff.minutesDifference} minutes ago`
    }`;
  if (diff.secondsDifference > 0)
    return `${
      diff.secondsDifference <= 1
        ? `${diff.secondsDifference} second ago`
        : `${diff.secondsDifference} seconds ago`
    }`;
  return "Bây giờ";
};

export { dateToTs, getDateDiff, calculateDateDistance };
