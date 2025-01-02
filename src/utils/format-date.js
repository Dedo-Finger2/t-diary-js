export function formatDateYYYYMMDD(today) {
  const todaySplitted = today.split("/");
  const month = todaySplitted[0];
  const date = todaySplitted[1];
  const year = todaySplitted[2];
  const monthWithZeroAtStart = month.length === 1 ? "0" + month : month;
  const dateWithZeroAtStart = date.length === 1 ? "0" + date : date;
  const formattedTodayDate = `${year}-${monthWithZeroAtStart}-${dateWithZeroAtStart}`;
  return formattedTodayDate;
}
