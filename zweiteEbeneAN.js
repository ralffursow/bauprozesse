//das html element, wo das diagramm angezeigt wird
const divMermaid = document.getElementById('ebene2AN');
const modal = document.querySelector('.modal');
//um modal zu schließen
const closeButton = document.querySelector('.close-button');

//hier werden alle prozesse gespeichert
let alleProzesse = [];
//in dieser variable wird der syntax für die clicks gespeichert
let clickHandlerSyntax = '';

//modal schließen, wenn auf dem schwarzen hintergrund geklickt wird
function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

//modal sichtbar und unsichtbar machen
function toggleModal() {
  modal.classList.toggle('show-modal');
}

closeButton.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);

//diese funktion wird ausgeführt, wenn auf den prozess geklickt wird
var printTask = function (taskId) {
  //den prozess auslesen, der angeklickt wurde
  const clickedProzess = getProzessById(+taskId.replace('p', ''));
  //der header des modals (siehe html code)
  const name = document.querySelector('.name');
  const perspektive = document.querySelector('.perspektive');
  const phase = document.querySelector('.phase');
  const bereich = document.querySelector('.bereich')
  const beteiligte = document.querySelector('.beteiligte')
  //den prozessnamen als überschrift hinzufügen
  name.innerHTML = clickedProzess.name;
  perspektive.innerHTML = clickedProzess.perspektive;
  phase.innerHTML = clickedProzess.phase;
  bereich.innerHTML = clickedProzess.bereich;
  beteiligte.innerHTML = clickedProzess.beteiligte;

  toggleModal();
};

//die prozesse aus der lokalen datei alleProzesse.json lesen
const getProzesse = async () => {
  const res = await fetch('./srcProzesse/filteredProzesseAN.json');
  const prozesse = await res.json();
  return prozesse;
};

//gibt einen prozess anhand der id zurück
const getProzessById = (id) => {
  return alleProzesse.find((prozess) => prozess.id === id);
};

//die dauer eines prozesses als zufallstahl zwischen 1 und 10 hinzufügen
const addDauer = (prozess) => {
  prozess.dauer = Math.floor(Math.random() * 10) + 3;
};

//einen prozess in dem mermaid syntax erstellen
const createMermaidProzess = (prozess, startdatum) => {
  //nur ein startdatum hinzufügen, wenn eines existiert
  const startStr = startdatum ? `${startdatum}` : `after p${prozess?.pre}`;
  //die dauer in tagen
  const tageCount = `${prozess.dauer}d`;
  //den syntayx für mermaid erstellen
  const mermaidSyntax = `${prozess.name}: p${prozess.id},${startStr},${tageCount}\n`;

  //den syntax für die clicks generieren
  clickHandlerSyntax += `click p${prozess.id} call printTask()\n`;

  //das ganze zu dem html element hinzufügen
  divMermaid.innerHTML += mermaidSyntax;
};

getProzesse().then((prozesse) => {
  alleProzesse = prozesse;

  //den startprozess auslesen (prozess der als einziger keinen vorgänger hat)
  let startProzess = alleProzesse.find((prozess) => prozess.pre === '');

  //die dauer für den startprozess hinzufügen
  addDauer(startProzess);
  createMermaidProzess(startProzess, '2022-03-22');

  printNachfolger(startProzess);

  //den syntax für die clicks hinzufügen
  divMermaid.innerHTML += `\n\n${clickHandlerSyntax}`;
  console.log(clickHandlerSyntax);
});

const printNachfolger = (prozess) => {
  if (!prozess) return;
  //die nachfolger (id) des startprozesses auslesen
  let nachfolger = prozess?.next.split(',');
  //manchmal sind als nachfolger nur leere strings drin, diese entfernen
  nachfolger = nachfolger.filter((nachfolger) => nachfolger !== '');
  //abbrechen, wenn keine nachfolger existieren
  if (nachfolger.length === 0) {
    return;
  }
  //schleife über die nachfolger
  for (let i = 0; i < nachfolger.length; i++) {
    //der nachfolger wird ausgelesen
    let nachfolgerProzess = getProzessById(parseInt(nachfolger[i]));
    //nur prozesse der zweiten ebene ausgeben
    if (!nachfolgerProzess || nachfolgerProzess.ebene !== 2) {
      continue;
    }
    //die dauer für jeden prozess hinzufügen
    addDauer(nachfolgerProzess);
    createMermaidProzess(nachfolgerProzess);
  }

  /*
  alle nachfolger des starprozesses sind an dieser Stelle ausgegeben
  jetzt müssen die nachfolger der nachfolger ausgegeben werden
  */
  for (let i = 0; i < nachfolger.length; i++) {
    let nachfolgerProzess = getProzessById(parseInt(nachfolger[i]));
    printNachfolger(nachfolgerProzess);
  }
};
