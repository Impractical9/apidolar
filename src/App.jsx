import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [trmData, setTrmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const getTrmData = async () => {
  try {
    const response = await axios.get(
      "https://www.datos.gov.co/resource/32sa-8pi3.json?$query=SELECT valor, vigenciadesde, vigenciahasta ORDER BY vigenciadesde DESC LIMIT 1"
    );
    if (response.data.length === 0) {
      throw new Error("No se encontraron datos de TRM");
    }
    setTrmData(response.data[0]);
    setLoading(false);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};

  useEffect(() => {
    getTrmData();
  }, []);

  if (loading) return <div className="loading">Cargando TRM...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!trmData) return <div className="no-data">No hay datos de TRM</div>;

  return (
    <div className="app-container">
      <h2>TRM Colombia (Peso Colombiano - USD)</h2>
      <div className="data-container">
        <div className="data-item highlight">
          <span className="data-label">Valor:</span>
          <span className="data-value">${trmData.valor} COP</span>
        </div>
        <div className="data-item">
          <span className="data-label">Vigente desde:</span>
          <span className="data-value">
            {new Date(trmData.vigenciadesde).toLocaleDateString('es-CO')}
          </span>
        </div>
        <div className="data-item">
          <span className="data-label">Vigente hasta:</span>
          <span className="data-value">
            {new Date(trmData.vigenciahasta).toLocaleDateString('es-CO')}
          </span>
        </div>
      </div>
      <p className="disclaimer">
        Fuente: <a href="https://www.banrep.gov.co" target="_blank" rel="noopener noreferrer">Banco de la República de Colombia</a>
      </p>
    </div>
  );
}

export default App;