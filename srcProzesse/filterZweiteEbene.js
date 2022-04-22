/**
 * Da es ziemlich unübersichtlich ist alle Prozesse auf einmal einzulesen, filter ich hier erstmal die relevanten Prozesse und speicher diese als neue JSON-Datei ab.
 */

const fs = require('fs');
//alleProzesse.json in array einlesen
const alleProzesse = require('./alleProzesse.json');

//es gibt zwei sichten (auftraggeber und auftragnehmer), daher müssen diese zuerst gefiltert werden (unterschiedliche prozesse)
let auftraggeberProzesse = alleProzesse.filter(
  (prozess) => prozess.perspektive === 'Auftraggeber'
);

//nur die prozesse der zweiten ebene filtern
auftraggeberProzesse = auftraggeberProzesse.filter(
  (prozess) => prozess.ebene === 2
);

//die prozesse als json speichern
fs.writeFileSync(
  './srcProzesse/filteredProzesse.json',
  JSON.stringify(auftraggeberProzesse)
);
