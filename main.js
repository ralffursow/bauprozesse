//das html element, wo das diagramm angezeigt wird
const divMermaid = document.getElementById('ebene2');
console.log('Hallo, los gehts!');
//hier werden alle prozesse gespeichert
let alleProzesse = [];
//die prozesse aus der lokalen datei alleProzesse.json lesen
const getProzesse = async () => {
  const res = await fetch('./alleProzesse.json');
  const prozesse = await res.json();
  return prozesse;
};

//gibt einen prozess anhand der id zurück
const getProzessById = (id) => {
  return alleProzesse.find((prozess) => prozess.id === id);
};

//die dauer eines prozesses als zufallstahl zwischen 1 und 10 hinzufügen
const addDauer = (prozess) => {
  prozess.dauer = Math.floor(Math.random() * 10) + 1;
};

//einen prozess in dem mermaid syntax erstellen
const createMermaidProzess = (prozess, startdatum) => {
  //nur ein startdatum hinzufügen, wenn eines existiert
  const startStr = startdatum ? `${startdatum},` : '';
  //die dauer in tagen
  const tageCount = `${prozess.dauer}d`;
  //den syntayx für mermaid erstellen
  const mermaidSyntax = `${prozess.name}: ${startStr} ${tageCount}\n`;
  //das ganze zu dem html element hinzufügen
  divMermaid.innerHTML += mermaidSyntax;
};

getProzesse().then((prozesse) => {
  alleProzesse = prozesse;
  console.log(alleProzesse);
  //es gibt zwei sichten (auftraggeber und auftragnehmer), daher müssen diese zuerst gefiltert werden (unterschiedliche prozesse)
  let auftraggeberProzesse = alleProzesse.filter(
    (prozess) => prozess.perspektive === 'Auftraggeber'
  );
  console.log(auftraggeberProzesse);
  //nur die prozesse der zweiten ebene filtern
  auftraggeberProzesse = auftraggeberProzesse.filter(
    (prozess) => prozess.ebene === 2
  );

  //den startprozess auslesen (prozess der als einziger keinen vorgänger hat)
  let startProzess = auftraggeberProzesse.find((prozess) => prozess.pre === '');

  //die dauer für den startprozess hinzufügen
  addDauer(startProzess);
  createMermaidProzess(startProzess, '2022-03-22');

  printNachfolger(startProzess);
});

const printNachfolger = (prozess) => {
  //die nachfolger (id) des startprozesses auslesen
  let nachfolger = prozess?.next.split(',');
  //schleife über die nachfolger
  for (let i = 0; i < nachfolger.length; i++) {
    //der nachfolger wird ausgelesen
    let nachfolgerProzess = getProzessById(parseInt(nachfolger[i]));
    //die dauer für jeden prozess hinzufügen
    addDauer(nachfolgerProzess);
    createMermaidProzess(nachfolgerProzess);
  }
};
