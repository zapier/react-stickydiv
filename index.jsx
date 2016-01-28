"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var util = require('dom-find');
var SimplePageScrollMixin = {
    componentDidMount: function () {
        window.addEventListener('scroll', this.onScroll, false);
    },
    componentWillUnmount: function () {
        window.removeEventListener('scroll', this.onScroll, false);
    }
};
var SimpleResizeMixin = {
    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    }
};

var StickyDiv = React.createClass({
    mixins: [SimplePageScrollMixin, SimpleResizeMixin],
    displayName:"StickyDiv",
    propTypes:{
        offsetTop: React.PropTypes.number,
        zIndex: React.PropTypes.number,
        className: React.PropTypes.string,
        containerBottom: React.PropTypes.number
    },
    getInitialState : function(){
        return {
            fix: false,
            width: null,
            height: null
        };
    },
    getDefaultProps: function() {
        return {
            offsetTop: 0,
            className: '',
            zIndex: 9999,
            containerBottom: null
        };
    },
    handleResize : function(){
        this.checkWidth();
        var height = this.checkHeight();
        this.checkPositions(height);
    },
    onScroll: function () {
        this.checkWidth();
        var height = this.checkHeight();
        this.checkPositions(height);
    },
    checkPositions: function(height) {
        var pos = util.findPosRelativeToViewport(ReactDOM.findDOMNode(this));
        var top = pos[1];

        if (top<=this.props.offsetTop && (
            !this.props.containerBottom || height < (this.props.containerBottom - top)
        )){
            this.setState({fix: true});
        } else {
            this.setState({fix: false});
        }
    },
    checkWidth: function () {
        var width = null;
        if (this.refs.duplicate) {
            width = this.refs.duplicate.getBoundingClientRect().width;
        } else {
            width = this.refs.original.getBoundingClientRect().width;
        }
        if (this.state.width !== width) {
            this.setState({
                width: width
            });
        }
    },
    checkHeight: function () {
        var height = this.refs.original.getBoundingClientRect().height;
        console.log('height:', height);
        if (this.state.height !== height) {
            this.setState({
                height: height
            });
        }
        return height;
    },
    componentDidMount: function () {
        this.checkWidth();
        this.checkHeight();
    },
    render: function () {
        var divStyle;

        if (this.state.fix) {
            var top = this.props.offsetTop;
            if (this.props.containerBottom) {
                if (top + this.state.height > this.props.containerBottom) {
                    top = this.props.containerBottom - this.state.height;
                }
            }

            divStyle = {
                display: 'block',
                position: 'fixed',
                width: this.state.width ? (this.state.width + 'px') : null,
                top: top
            };
            return <div style={{zIndex : this.props.zIndex, position:'relative', width:'100%'}}>
                <div ref='duplicate' key='duplicate' style={{visibility:'hidden'}}>
            {this.props.children}
                </div>
                <div ref='original' key='original' className={this.props.className} style={divStyle} >
            {this.props.children}
                </div>
            </div>;
        }
        else {
            divStyle = {
                display: 'block',
                position: 'relative'
            };
            return <div style={{zIndex : this.props.zIndex, position:'relative', width:'100%'}}>
                <div ref='original' key='original' style={divStyle}>
          {this.props.children}
                </div>
            </div>;
        }
    }
});

module.exports = StickyDiv;
