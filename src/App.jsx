import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [trmData, setTrmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isUsdToCop, setIsUsdToCop] = useState(true); // true: USD→COP, false: COP→USD

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

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && trmData) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        const result = isUsdToCop 
          ? numericValue * parseFloat(trmData.valor) 
          : numericValue / parseFloat(trmData.valor);
        setConvertedAmount(result.toFixed(2));
      } else {
        setConvertedAmount(null);
      }
    } else {
      setConvertedAmount(null);
    }
  };

  const toggleConversion = () => {
    setIsUsdToCop(!isUsdToCop);
    setAmount('');
    setConvertedAmount(null);
  };

  useEffect(() => {
    getTrmData();
  }, []);

  if (loading) return <div className="loading">Cargando TRM...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!trmData) return <div className="no-data">No hay datos de TRM</div>;

  return (
    <div className="app-container">
      <h2>TRM Colombia</h2>
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

      {/* Sección de conversión */}
      <div className="converter-container">
        <h3>Conversor de divisas</h3>
        <div className="conversion-toggle">
          <button 
            onClick={toggleConversion}
            className={isUsdToCop ? 'active' : ''}
          >
            USD → COP
          </button>
          <button 
            onClick={toggleConversion}
            className={!isUsdToCop ? 'active' : ''}
          >
            COP → USD
          </button>
        </div>
        
        <div className="input-group">
          <label>
            {isUsdToCop ? 'Cantidad en USD:' : 'Cantidad en COP:'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Ej: ${isUsdToCop ? '100' : '100000'}`}
          />
        </div>

        {convertedAmount !== null && (
          <div className="result">
            <p>
              {amount} {isUsdToCop ? 'USD' : 'COP'} = {convertedAmount} {isUsdToCop ? 'COP' : 'USD'}
            </p>
            <p className="exchange-rate">
              (Tasa: 1 USD = {trmData.valor} COP)
            </p>
          </div>
        )}
      </div>

      <p className="disclaimer">
        Fuente: <a href="https://www.banrep.gov.co" target="_blank" rel="noopener noreferrer">Banco de la República de Colombia</a>
      </p>
      <p className="disclaimer">
      <a href="" target="" rel="">Versión 1.1</a>
      </p>
      
    </div>
    
  );
}

export default App;