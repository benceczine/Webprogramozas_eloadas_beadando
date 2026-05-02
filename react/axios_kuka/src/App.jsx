import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [osszesNagydij, setOsszesNagydij] = useState([]);
    const [aktualisAdat, setAktualisAdat] = useState({ id: '', datum: '', nev: '', helyszin: '' });
    const [keresoSzoveg, setKeresoSzoveg] = useState('');

    useEffect(() => {
        cuccokBetoltese();
    }, []);

    const cuccokBetoltese = () => {
        axios.get('api.php').then(eredmeny => {
            setOsszesNagydij(eredmeny.data);
        });
    };

    const mezoBeiras = (esemeny) => {
        const { name, value } = esemeny.target;
        setAktualisAdat({ ...aktualisAdat, [name]: value });
    };

    const gombKattintasMentese = (e) => {
        e.preventDefault();
        if (aktualisAdat.id === '') {
            axios.post('api.php', aktualisAdat).then(() => {
                cuccokBetoltese();
                setAktualisAdat({ id: '', datum: '', nev: '', helyszin: '' });
            });
        } else {
            axios.put('api.php', aktualisAdat).then(() => {
                cuccokBetoltese();
                setAktualisAdat({ id: '', datum: '', nev: '', helyszin: '' });
            });
        }
    };

    const gombKattintasTorlese = (torlendoId) => {
        axios.delete('api.php', { data: { id: torlendoId } }).then(() => {
            cuccokBetoltese();
        });
    };

    const beleToltSzerkeszto = (sor) => {
        setAktualisAdat(sor);
    };

    return (
        <div className="content-wrapper">
            <h2 className="page-title">React Axios CRUD kezelő </h2>
            
            <input 
                type="text" 
                placeholder="Keresés név vagy helyszín alapján..." 
                value={keresoSzoveg} 
                onChange={(e) => setKeresoSzoveg(e.target.value)} 
                style={{ marginBottom: '15px', padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />

            <div className="form-box">
                <form onSubmit={gombKattintasMentese}>
                    <div>
                        <label>Dátum</label>
                        <input type="date" name="datum" value={aktualisAdat.datum} onChange={mezoBeiras} />
                    </div>
                    <div>
                        <label>Név</label>
                        <input type="text" name="nev" value={aktualisAdat.nev} onChange={mezoBeiras} />
                    </div>
                    <div>
                        <label>Helyszín</label>
                        <input type="text" name="helyszin" value={aktualisAdat.helyszin} onChange={mezoBeiras} />
                    </div>
                    <div className="form-action-buttons">
                        <button type="submit">Mentés</button>
                    </div>
                </form>
            </div>

            <table className="list">
                <thead>
                    <tr>
                        <th>Dátum</th>
                        <th>Név</th>
                        <th>Helyszín</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {osszesNagydij.filter((egySor) => {
                        if (keresoSzoveg === '') return true;
                        let nevBenneVan = egySor.nev && egySor.nev.toLowerCase().includes(keresoSzoveg.toLowerCase());
                        let helyBenneVan = egySor.helyszin && egySor.helyszin.toLowerCase().includes(keresoSzoveg.toLowerCase());
                        return nevBenneVan || helyBenneVan;
                    }).map((egySor, indexSzam) => (
                        <tr key={indexSzam}>
                            <td>{egySor.datum !== null ? egySor.datum : ''}</td>
                            <td>{egySor.nev !== null ? egySor.nev : ''}</td>
                            <td>{egySor.helyszin !== null ? egySor.helyszin : ''}</td>
                            <td>
                                <a style={{ cursor: 'pointer' }} onClick={() => beleToltSzerkeszto(egySor)}>EDIT</a>
                                <a style={{ cursor: 'pointer' }} onClick={() => gombKattintasTorlese(egySor.id)}>DELETE</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;