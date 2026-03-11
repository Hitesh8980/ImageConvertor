const MOCK_COMPONENTS = [
  { id: 1, name: 'Resistor',    symbol: 'R',   color: '#22d3ee', description: 'Limits current flow' },
  { id: 2, name: 'Capacitor',   symbol: 'C',   color: '#a78bfa', description: 'Stores electric charge' },
  { id: 3, name: 'Diode',       symbol: 'D',   color: '#34d399', description: 'Allows one-way current' },
  { id: 4, name: 'Transistor',  symbol: 'Q',   color: '#fb923c', description: 'Amplifies/switches signals' },
  { id: 5, name: 'Inductor',    symbol: 'L',   color: '#f472b6', description: 'Stores magnetic energy' },
  { id: 6, name: 'Op-Amp',      symbol: 'U',   color: '#facc15', description: 'Amplifies voltage diff' },
  { id: 7, name: 'Transformer', symbol: 'T',   color: '#60a5fa', description: 'Transfers AC energy' },
  { id: 8, name: 'Ground',      symbol: 'GND', color: '#4ade80', description: 'Reference zero voltage' },
];

export const fetchComponents = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_COMPONENTS), 900);
  });
};