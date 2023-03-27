import logo from './logo.svg';
import './App.css';
import React from "react";

class Greet extends React.Component {
	
	constructor(props){
		super(props);
		
		this.state = {val: "awesome", type: 0};
	}
	
	
	changeValue = () => {
		this.setState(
        
          {val: "wonderful", type: 1}
        
          
        
			
			);
		}
	
	render(){
		return(
			<div>
				<h1>Hello {this.state.val} World</h1>
				<button type="button" onClick={this.changeValue}>Change value</button>
			</div>
		);
	}
}

function App() {
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
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Greet;
