import React, {Component} from 'react';
import Header from './components/Header'

export default class Builder extends Component{

    constructor(props){
        super(props);
        this.state={
            visibleNav:false,
            selected:null,
            step:1,
        }
    }

    render(){
        const {visibleNav,selected,step}=this.state;
        return(
            <div className={`Builder ${selected}`} ref="self">
                <div className="builder-bg" ref="bg" />
                <canvas id="viewport"></canvas>
                <Header />
            </div>

        )
    }


}