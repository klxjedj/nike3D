import React, { Component } from 'react';
import Builder from './builder/Builder'

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <Builder></Builder>
            </div>
        );
    }
}

export default App;