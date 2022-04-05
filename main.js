//die prozesse aus der lokalen datei alleProzesse.json lesen
const getProzesse = async () => {
  const res = await fetch('./alleProzesse.json');
  const prozesse = await res.json();
  return prozesse;
};

getProzesse().then((prozesse) => {
  console.log(prozesse);
});
//console.log(prozesse);
//die prozesse in die tabelle einfügen

// const alleProzesse = JSON.parse('alleProzesse.json');
// console.log(alleProzesse);

// const alleBauprozesse = [];
// const Bauprozess = {};
// for (let i = 0; i < alleProzesse; i++) {
//     switch (i % ) {
//         case 0:

//     }
// }
