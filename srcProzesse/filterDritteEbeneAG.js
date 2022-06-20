/**
 * Da es ziemlich unübersichtlich ist alle Prozesse auf einmal einzulesen, filter ich hier erstmal die relevanten Prozesse und speicher diese als neue JSON-Datei ab.
 */

const fs = require('fs');
//alleProzesse.json in array einlesen
const alleProzesse = require('./alleProzesse.json');

//gibt einen prozess anhand der id zurück
const getProzessById = (id) => {
  return alleProzesse.find((prozess) => prozess.id === id);
};

//es gibt zwei sichten (auftraggeber und auftragnehmer), daher müssen diese zuerst gefiltert werden (unterschiedliche prozesse)
let auftraggeberProzesse = alleProzesse.filter(
  (prozess) => prozess.perspektive === 'Auftraggeber'
);

//nur die prozesse der zweiten ebene filtern
auftraggeberProzesse = auftraggeberProzesse.filter(
  (prozess) => prozess.ebene === 3
);

//alle prozesse herausfiltern, die keinen vorgeanger und keinen nachfolger haben
auftraggeberProzesse = auftraggeberProzesse.filter(
  (prozess) => prozess.pre !== '' || prozess.next !== ''
);

//gleiche prozesse zusammenführen
const neueProzesse = [];
for (let i = 0; i < auftraggeberProzesse.length; i++) {
  const prozess = auftraggeberProzesse[i];
  let vorgaengerID = parseInt(prozess?.pre);
  if (vorgaengerID === NaN) {
    neueProzesse.push(prozess);
    continue;
  }
  const vorgaengerProzess = getProzessById(vorgaengerID);
  //wenn der vorgaengerprozess den gleichen Namen hat, kann dieser übersprungen werden
  if (vorgaengerProzess?.name === prozess.name) {
    continue;
  }

  neueProzesse.push(prozess);
}

//die prozesse als json speichern
fs.writeFileSync(
  './srcProzesse/filteredProzesseDritteEbeneAG.json',
  JSON.stringify(neueProzesse)
);