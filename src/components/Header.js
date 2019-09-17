import React, { Component } from 'react';
import Button from './Button';
import { TweenLite } from 'gsap';
import * as BuilderActions from '../actions/BuilderActions';
import BuilderStore from '../store/BuilderStore';

export default class Header extends Component {

    state = {
        customizing: null
    }

    componentDidMount = () => {
        this.initEventListeners();
        this.show();
    }

    show = () => {
        TweenLite.set(this.refs.self, { display: 'block' })
        if (this.refs.nav) {
            TweenLite.to(this.refs.nav, 1, { marginTop: 0, ease: 'easeInOutExpo' })
        }
    }

    handleBackClick = () => {
        if (this.state.customizing !== null) {
            BuilderActions.applyInterestCustomization(this.state.customizing);
        } else {
            BuilderActions.selectShoe(null);
            this.props.onNavClick(-1);
        }
    }

    onApplyInterest = (interest) => {
        this.setState({ customizing: null });
    }

    onBeginCustomization = (status) => {
        if (status) {
          this.show();
        } else {
          this.hide(false);
        }
      }

    initEventListeners = () => {
        BuilderStore.on('applyInterest', this.onApplyInterest.bind(this))
        BuilderStore.on('beginCustomization', this.onBeginCustomization.bind(this));
    }

    render() {
        const { customizing } = this.state;
        const isPrebuildLearn = customizing && typeof customizing === 'string';
        return (
            <div className="Header" ref="self">
                <div className="step-group-nav" ref="nav">
                    <Button ref="back"
                        disabled={customizing === null}
                        icon={customizing !== null ? 'back-white' : ''}
                        theme={customizing !== null ? 'dark' : 'transparent'}
                        className="nav-back" onClick={this.handleBackClick}
                        hidden={isPrebuildLearn} />

                </div>
            </div>
        )
    }
}