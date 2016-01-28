"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
var util = require("dom-find");
var SimplePageScrollMixin = {
    componentDidMount: function componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    },
    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }
};
var SimpleResizeMixin = {
    componentDidMount: function componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    },

    componentWillUnmount: function componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }
};

var StickyDiv = React.createClass({
    mixins: [SimplePageScrollMixin, SimpleResizeMixin],
    displayName: "StickyDiv",
    propTypes: {
        offsetTop: React.PropTypes.number,
        zIndex: React.PropTypes.number,
        className: React.PropTypes.string,
        containerBottom: React.PropTypes.number
    },
    getInitialState: function getInitialState() {
        return {
            fix: false,
            width: null,
            height: null
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            offsetTop: 0,
            className: "",
            zIndex: 9999,
            containerBottom: null
        };
    },
    handleResize: function handleResize() {
        this.checkWidth();
        var height = this.checkHeight();
        this.checkPositions(height);
    },
    onScroll: function onScroll() {
        this.checkWidth();
        var height = this.checkHeight();
        this.checkPositions(height);
    },
    checkPositions: function checkPositions(height) {
        var pos = util.findPosRelativeToViewport(ReactDOM.findDOMNode(this));
        var top = pos[1];

        if (top <= this.props.offsetTop && (!this.props.containerBottom || height < this.props.containerBottom - top)) {
            this.setState({ fix: true });
        } else {
            this.setState({ fix: false });
        }
    },
    checkWidth: function checkWidth() {
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
    checkHeight: function checkHeight() {
        var height = this.refs.original.getBoundingClientRect().height;
        if (this.state.height !== height) {
            this.setState({
                height: height
            });
        }
        return height;
    },
    componentDidMount: function componentDidMount() {
        this.checkWidth();
        this.checkHeight();
    },
    render: function render() {
        var divStyle;

        if (this.state.fix) {
            var top = this.props.offsetTop;
            if (this.props.containerBottom) {
                if (top + this.state.height > this.props.containerBottom) {
                    top = this.props.containerBottom - this.state.height;
                }
            }

            divStyle = {
                display: "block",
                position: "fixed",
                width: this.state.width ? this.state.width + "px" : null,
                top: top
            };
            return React.createElement(
                "div",
                { style: { zIndex: this.props.zIndex, position: "relative", width: "100%" } },
                React.createElement(
                    "div",
                    { ref: "duplicate", key: "duplicate", style: { visibility: "hidden" } },
                    this.props.children
                ),
                React.createElement(
                    "div",
                    { ref: "original", key: "original", className: this.props.className, style: divStyle },
                    this.props.children
                )
            );
        } else {
            divStyle = {
                display: "block",
                position: "relative"
            };
            return React.createElement(
                "div",
                { style: { zIndex: this.props.zIndex, position: "relative", width: "100%" } },
                React.createElement(
                    "div",
                    { ref: "original", key: "original", style: divStyle },
                    this.props.children
                )
            );
        }
    }
});

module.exports = StickyDiv;