function Home() {
    return React.createElement('h1', null, "Hallo Test")
}



// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
// Komponente als Funktion aufrufen
root.render(React.createElement(Home));