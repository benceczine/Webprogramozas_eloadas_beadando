// ══════════════════════════════════════════════════════════════
//  F1 Garázs – OO JavaScript grafikus alkalmazás
//
//  OSZTÁLYHIERARCHIA:
//
//  Vehicle  ← alap osztály (minden járműnek van neve és színe)
//    └── Car  ← extends Vehicle (autónak van motorja és gumija)
//          └── F1Car  ← extends Car (F1 autónak van csapata,
//                                    üzemanyagja, és metódusai)
// ══════════════════════════════════════════════════════════════


// ── 1. ALAP OSZTÁLY: Vehicle ───────────────────────────────────
// Ez a "legáltalánosabb" jármű – csak neve és színe van.
// Minden más osztály ebből örököl.

class Vehicle {
    constructor(nev, szin) {
        // A constructor fut le amikor létrehozunk egy új objektumot
        // pl: new Vehicle("Ferrari", "#e10600")
        this.nev  = nev;   // this = az éppen létrehozott objektum
        this.szin = szin;
    }

    // Metódus: visszaadja az alap infót
    getInfo() {
        return `${this.nev}`;
    }
}


// ── 2. CAR OSZTÁLY: extends Vehicle ───────────────────────────
// Az autó egy jármű – örökli a nevet és a színt,
// de van még motorteljesítménye és gumiállapota is.

class Car extends Vehicle {
    constructor(nev, szin, motor) {
        super(nev, szin);  // meghívja a Vehicle constructorát
                           // (beállítja a nevet és a színt)
        this.motor = motor;  // pl: "1000 LE"
        this.gumi  = "SOFT"; // alapértelmezett gumi
    }

    // Metódus: gumicsere – megváltoztatja a gumi típusát
    gumicsere(ujGumi) {
        this.gumi = ujGumi;
    }

    // Felülírja a Vehicle getInfo() metódusát – több infót ad vissza
    getInfo() {
        return `${super.getInfo()} | Motor: ${this.motor}`;
        //       ↑ super.getInfo() = meghívja a Vehicle getInfo()-t
        //         ami visszaadja a nevet
    }
}


// ── 3. F1CAR OSZTÁLY: extends Car ─────────────────────────────
// Az F1 autó egy autó – örökli a nevet, színt, motort, gumit,
// de van még csapata, üzemanyag szintje, és DOM eleme is.

class F1Car extends Car {
    constructor(nev, csapat, szin, motor) {
        super(nev, szin, motor);  // meghívja a Car constructorát
        this.csapat      = csapat;
        this.uzemanyag   = 100;   // % – teljes tank induláskor
        this.domElem     = null;  // ide kerül majd a HTML kártya
    }

    // Metódus: tankolás – növeli az üzemanyag szintet
    tankol(mennyiseg) {
        this.uzemanyag = Math.min(100, this.uzemanyag + mennyiseg);
        // Math.min(100, ...) = nem mehet 100% fölé
    }

    // Metódus: fogyaszt – csökkenti az üzemanyag szintet
    fogyaszt(mennyiseg) {
        this.uzemanyag = Math.max(0, this.uzemanyag - mennyiseg);
        // Math.max(0, ...) = nem mehet 0% alá
    }

    // Visszaadja a gumi színét (piros/sárga/fehér)
    gumiSzin() {
        if (this.gumi === "SOFT")   return "#e10600";  // piros
        if (this.gumi === "MEDIUM") return "#ffd700";  // sárga
        if (this.gumi === "HARD")   return "#f0f0f0";  // fehér
        return "#888";
    }

    // Visszaadja az üzemanyag progress bar színét
    tankSzin() {
        if (this.uzemanyag > 60) return "#22c55e";  // zöld
        if (this.uzemanyag > 30) return "#fbbf24";  // sárga
        return "#e10600";                            // piros
    }

    // ── LEGFONTOSABB METÓDUS: createDOM() ──────────────────────
    // Ez hozza létre a HTML kártyát JavaScript-ből.
    // Minden elemet document.createElement()-tel hozunk létre,
    // majd appendChild()-dal rakjuk össze.

    createDOM() {
        // 1. Fő kártya div létrehozása
        const kartya = document.createElement('div');
        kartya.classList.add('f1-kartya');
        kartya.style.borderTopColor = this.szin;

        // 2. Fejléc (csapat neve + szín csík)
        const fejlec = document.createElement('div');
        fejlec.classList.add('kartya-fejlec');

        const szinCsik = document.createElement('span');
        szinCsik.classList.add('szin-csik');
        szinCsik.style.background = this.szin;

        const nev = document.createElement('span');
        nev.classList.add('auto-nev');
        nev.textContent = this.nev;

        const csapat = document.createElement('span');
        csapat.classList.add('csapat-nev');
        csapat.textContent = this.csapat;

        // appendChild: a szín csíkot és a nevet belerakjuk a fejlécbe
        fejlec.appendChild(szinCsik);
        fejlec.appendChild(nev);
        fejlec.appendChild(csapat);

        // 3. Gumi sor
        const gumiSor = document.createElement('div');
        gumiSor.classList.add('info-sor');

        const gumiLabel = document.createElement('span');
        gumiLabel.classList.add('info-label');
        gumiLabel.textContent = 'GUMI';

        const gumiJelzo = document.createElement('span');
        gumiJelzo.classList.add('gumi-jelzo');
        gumiJelzo.id = `gumi-${this.nev.replace(/\s/g, '')}`;
        gumiJelzo.textContent = this.gumi;
        gumiJelzo.style.background = this.gumiSzin();

        gumiSor.appendChild(gumiLabel);
        gumiSor.appendChild(gumiJelzo);

        // 4. Üzemanyag sor (progress bar)
        const tankSor = document.createElement('div');
        tankSor.classList.add('info-sor');

        const tankLabel = document.createElement('span');
        tankLabel.classList.add('info-label');
        tankLabel.textContent = 'TANK';

        const tankWrapper = document.createElement('div');
        tankWrapper.classList.add('tank-wrapper');

        const tankBar = document.createElement('div');
        tankBar.classList.add('tank-bar');
        tankBar.id = `tank-${this.nev.replace(/\s/g, '')}`;
        tankBar.style.width   = this.uzemanyag + '%';
        tankBar.style.background = this.tankSzin();

        const tankSzazalek = document.createElement('span');
        tankSzazalek.classList.add('tank-szazalek');
        tankSzazalek.id = `tankpct-${this.nev.replace(/\s/g, '')}`;
        tankSzazalek.textContent = this.uzemanyag + '%';

        tankWrapper.appendChild(tankBar);
        tankSor.appendChild(tankLabel);
        tankSor.appendChild(tankWrapper);
        tankSor.appendChild(tankSzazalek);

        // 5. Gombok sora
        const gombSor = document.createElement('div');
        gombSor.classList.add('gomb-sor');

        // Gumicsere gombok
        ['SOFT', 'MEDIUM', 'HARD'].forEach(tipus => {
            const gomb = document.createElement('button');
            gomb.classList.add('gumi-gomb');
            gomb.textContent = tipus;
            gomb.style.borderColor = tipus === 'SOFT' ? '#e10600' :
                                     tipus === 'MEDIUM' ? '#ffd700' : '#f0f0f0';
            // Kattintáskor: gumicsere + DOM frissítés
            gomb.addEventListener('click', () => {
                this.gumicsere(tipus);   // meghívja a Car metódusát
                this.updateDOM();        // frissíti a kártyát
            });
            gombSor.appendChild(gomb);
        });

        // Fogyaszt gomb (szimulálja a versenyt)
        const fogyasztGomb = document.createElement('button');
        fogyasztGomb.classList.add('fogyaszt-gomb');
        fogyasztGomb.textContent = '▶ Kör';
        fogyasztGomb.addEventListener('click', () => {
            this.fogyaszt(15);   // minden kör 15% üzemanyagot fogyaszt
            this.updateDOM();
        });
        gombSor.appendChild(fogyasztGomb);

        // Tankol gomb
        const tankolGomb = document.createElement('button');
        tankolGomb.classList.add('tankol-gomb');
        tankolGomb.textContent = '⛽ Tank';
        tankolGomb.addEventListener('click', () => {
            this.tankol(30);   // 30% üzemanyagot tölt
            this.updateDOM();
        });
        gombSor.appendChild(tankolGomb);

        // 6. Összerakjuk a kártyát – appendChild sorrendben
        kartya.appendChild(fejlec);
        kartya.appendChild(gumiSor);
        kartya.appendChild(tankSor);
        kartya.appendChild(gombSor);

        // Elmentjük a referenciát, hogy később updateDOM()-ban elérjük
        this.domElem = kartya;
        return kartya;
    }

    // ── updateDOM() ────────────────────────────────────────────
    // Frissíti a meglévő kártya értékeit (gumi, tank)
    // anélkül hogy újra létrehozná az egész kártyát.

    updateDOM() {
        const id = this.nev.replace(/\s/g, '');

        const gumiJelzo = document.getElementById(`gumi-${id}`);
        if (gumiJelzo) {
            gumiJelzo.textContent  = this.gumi;
            gumiJelzo.style.background = this.gumiSzin();
        }

        const tankBar = document.getElementById(`tank-${id}`);
        if (tankBar) {
            tankBar.style.width      = this.uzemanyag + '%';
            tankBar.style.background = this.tankSzin();
        }

        const tankPct = document.getElementById(`tankpct-${id}`);
        if (tankPct) {
            tankPct.textContent = this.uzemanyag + '%';
        }
    }
}


// ══════════════════════════════════════════════════════════════
//  ALKALMAZÁS INDÍTÁSA
//  Itt hozzuk létre az F1Car objektumokat és adjuk hozzá
//  a document.body.appendChild()-dal az oldalhoz.
// ══════════════════════════════════════════════════════════════

// Az autók adatai
const autoAdatok = [
    { nev: "Max Verstappen",  csapat: "Red Bull Racing", szin: "#3671C6", motor: "Honda 1000 LE" },
    { nev: "Charles Leclerc", csapat: "Scuderia Ferrari", szin: "#E8002D", motor: "Ferrari 1000 LE" },
    { nev: "Lando Norris",    csapat: "McLaren F1 Team",  szin: "#FF8000", motor: "Mercedes 1000 LE" },
];

// Várjuk meg hogy a DOM betöltsön
window.onload = () => {
    const garazs = document.getElementById('garazs');

    autoAdatok.forEach(adat => {
        // Új F1Car objektum létrehozása
        const auto = new F1Car(adat.nev, adat.csapat, adat.szin, adat.motor);

        // createDOM() létrehozza a HTML kártyát
        const kartya = auto.createDOM();

        // document.body.appendChild mintájára – a garázsba rakjuk
        garazs.appendChild(kartya);
    });
};
