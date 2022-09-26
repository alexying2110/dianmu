import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export class DarkTO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      buttonHeight: 35
    }
  }

  load() {
    this.setState({
      loading: true,
    });
  }

  endLoad() {
    this.setState({
      loading: false,
    });
  }

  render() {
    if (!this.state.loading) {
      return (
        <TouchableOpacity
          onLayout={(event) => {
            this.setState({
              buttonHeight: event.nativeEvent.layout.height,
            });
          }}
          disabled={this.props.disabled || this.state.loading}
          style={[styles.body, {backgroundColor: (this.props.disabled ? '#bbbbbb' : '#0089f2')}, this.props.style]}
          onPress={this.props.onPress}
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          disabled={this.props.disabled || this.state.loading}
          style={[styles.body, {backgroundColor: (this.props.disabled ? '#bbbbbb' : '#0089f2')}, {height: this.state.buttonHeight}, this.props.style]}
          onPress={this.props.onPress}
        >
          <View style={{flex: 1, justifyContent: "center"}}>
            <ActivityIndicator size={"small"} color={"#ffffff"}/>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

DarkTO.propTypes = {
  disabled: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  onPress: PropTypes.func,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ])
}

DarkTO.defaultProps = {
  disabled: false,
  style: {},
  textStyle: {},
  onPress() {
    return null;
  },
  text: [''],
}

const styles = StyleSheet.create({
  body: {
    margin: 10,
    width: '90%',
    borderRadius: 15,
    padding: 9,
    alignSelf: 'center',
    backgroundColor: '#0089f2',
  },
  text: {
    fontSize: 18,
    alignSelf: 'center',
    color: '#f5f5f5',
  },
});
