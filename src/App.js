import React, { Component } from 'react';
import Builder from './builder';

class App extends Component {
    
    constructor(props){
        super(props);
        require('events').EventEmitter.defaultMaxListeners=25;
        this.state={
            loaded:false
        }
    }

    componentDidMount = () => {
        document.addEventListener('gesturestart', function (e) {
          e.preventDefault();
        });
    }

    render(){
        return(
            <div className='App' >
                <Builder />
            </div>
        )
    }
};
export default App;