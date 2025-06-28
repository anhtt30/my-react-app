import logo from './logo.svg';
import './App.css';
import { useEffect, useState} from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React test
        </a>
      </header>
      <div>
        <h1>Welcome to My React App</h1>
        <p>This is a simple React application.</p>
        <p>data from server: {data}</p>
      </div>
    </div>
  );
}

export default App;
