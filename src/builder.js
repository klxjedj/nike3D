import React, { Component } from 'react';
import Header from './components/Header'
import * as builder from './lib/builder'
import BuilderStore from './store/BuilderStore'
import BuilderActions from './actions/BuilderActions'

const shoes = {
};


export default class Builder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      configuatorLoaded: false,
      visibleNav: false,
      selected: null,
      step: 1,
    }

    builder.getShoes().forEach((shoe) => {
      shoes[shoe] = require(`./lib/data/${shoe}.position`)
    });

    this._onConfiguratorTap = this.onConfiguratorTap.bind(this);
    this._onConfiguratorHover = this.onConfiguratorHover.bind(this);
    this._onConfiguratorDragEnd = this.onConfiguratorDragEnd.bind(this);
    this._onConfiguratorDragStart = this.onConfiguratorDragStart.bind(this);

    window.BuilderStore = BuilderStore;

  }

  componentDidMount() {
    builder.initialize({ callback: () => this.configuratorInitialized() })
    window.builder = builder;
    this.initEventListeners();
  }

  configuratorInitialized = () => {
    this.setState({ configuatorLoaded: true });
    window.configurator.on('click', this._onConfiguratorTap);
    window.configurator.on('hover', this._onConfiguratorHover);
    window.configurator.on('dragstart', this._onConfiguratorDragStart);
    window.configurator.on('dragend', this._onConfiguratorDragEnd);
  }

  initEventListeners = () => {
    BuilderStore.on('beginCustomization', this._onBeginCustomization);
    BuilderStore.on('activateQuestion', this._onActivateQuestion);
    BuilderStore.on('activateStep', this.activateStep);
    BuilderStore.on('applyInterest', this._onApplyInterest);
    BuilderStore.on('shoeLoaded', this._shoeLoaded);
    BuilderStore.on('groupChange', this.onChange);
  }

  onConfiguratorDragStart = (data) => {
    BuilderActions.drag(true);
  }

  onConfiguratorDragEnd = (data) => {
    BuilderActions.drag(false);
  }

  onConfiguratorTap = (data) => {
    /*
        if (data.shoe && this.state.step === 2 && BuilderStore.getTapStatus() === true) {
          let component = data.component.split('_')[2];
          let found = builder.getStepFromComponentTap(component);
    
          // » console.log(component, found);
    
          if (found && found.stepIndex !== undefined) {
            BuilderActions.customizeInterest(found.stepIndex, false, builder.getQuestion(found.questionId));
            // if (found.questionId !== undefined) {
            //   // TODO: need to set the active tab somehow?
            //   BuilderActions.activateQuestion(found.questionId);
            // }
          }
        }
    
        if (data.shoe && this.state.step === 1) {
          this.selectShoe(data.shoe);
        }
    */
  }

  onConfiguratorHover = (data) => {



  }
  render() {
    const { visibleNav, selected, step } = this.state;
    return (
      <div className={`Builder ${selected}`} ref="self">
        <div className="builder-bg" ref="bg" />
        <canvas id="viewport"></canvas>
        <Header />
      </div>

    )
  }


}