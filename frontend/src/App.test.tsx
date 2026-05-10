import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ Agent Performance League</h1>
      <p>Frontend is working!</p>
      
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Quick Test Data</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Agent</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ROI</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sharpe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Alice - Conservative</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>4.50%</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>18.76</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Bob - Aggressive</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>15.00%</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>10.62</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f4f8' }}>
        <p><strong>📊 Status:</strong></p>
        <p>✅ Hardhat Node: http://127.0.0.1:8545</p>
        <p>✅ Backend API: http://localhost:3001</p>
        <p>✅ Frontend: http://localhost:5173</p>
      </div>
    </div>
  );
}