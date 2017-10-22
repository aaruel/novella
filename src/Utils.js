const endPunc = ['.', '?', '!', ':', '-'];
const specialPunc = ['`'];

export const formatSen = (sen) => {
  if (sen) {
    sen = sen.trim();
    sen = sen[0].toUpperCase() + sen.substr(1);
    return (
      endPunc.includes(sen.slice(-1)) && !specialPunc.includes(sen[0])
        ? sen : `${sen}.`
    );
  }
  else {
    return sen;
  }
};