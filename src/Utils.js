const endPunc = ['.', '?', '!', ':', '-'];
const specialPunc = ['`'];

export const formatSen = (sen) => {
  sen = sen[0].toUpperCase() + sen.substr(1);
  return (
    endPunc.includes(sen.slice(-1)) && !specialPunc.includes(sen.slice(0))
      ? sen : `${sen}.`
  );
};