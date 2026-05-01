import { useEffect, useState } from "react";

export default function History() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h2>Prediction History</h2>

      {data.map((h, i) => (
        <div key={i}>
          <p>Input: {JSON.stringify(h.input)}</p>
          <ul>
            {h.results.map(r => (
              <li key={r.model}>
                {r.model}: {r.value} (ΔR: {r.deltaR})
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
}