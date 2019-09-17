import React, { Component } from 'react';

const ICONS = {
  'back-white':{
    src:require('../assets/back-white.svg'),
    alt:'back'
  }
};

export default class Button extends Component {

    static defaultProps = {
        className: '',
        disabled: false,
        onClick: () => { }
    }

    renderClass = () => {
        let cName = 'Button ' + this.props.className;
        if (this.props.theme !== undefined) {
            cName += " " + this.props.theme;
        }
        if (!this.props.title) {
            cName += ' icon-only';
        }
        if (this.props.disabled) {
            cName += ' disabled'
        }
        if (this.props.style) {
            cName += " " + this.props.style;
        }
        return cName;
    }

    handleClick = (e) => {
        if (!this.props.disabled) {
            this.props.onClick(e);
        }
    }
    render() {

        const { icon, title, hidden } = this.props;
        console.log(hidden);

        if (hidden) {
            return <div></div>;
        }
        

        const iconData = ICONS[icon];
        return (
            <div className={this.renderClass()} onClick={this.handleClick}>
                {this.props.progress > 0 && <div className="progress" style={{ 'width': '' + (this.props.progress * 100) + '%' }}></div>}
                {iconData && <img src={iconData.src} alt={iconData.alt} className="Button-icon" />}
                {title && <span>{title}</span>}
            </div>
        );
    }
}