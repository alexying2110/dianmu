import React, { Component } from "react";

import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Svg, { Line } from "react-native-svg";

import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

export class Timer extends Component {
  constructor(props) {
    super(props);
    this.modalRef = React.createRef(null);
    this.TIMER_STATES = {
      SET: "set",
      PAUSED: "paused",
      COUNTING: "going",
      END: "end",
    };
    this.state = {
      timerKey: 0,
      timerState: "set",
      timerHours: 0,
      timerMinutes: 2,
      timerSeconds: 0,
    };
  }

  renderButtons() {
    if (this.state.timerState === this.TIMER_STATES.SET) {
      return (
        <View style={styles.timerButtonSection}>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              this.setState({
                timerState: this.TIMER_STATES.COUNTING,
              });
            }}
          >
            <Text style={styles.timerButtonText}>
              Start
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (
      this.state.timerState === this.TIMER_STATES.COUNTING
    ) {
      return (
        <View style={styles.timerButtonSection}>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              this.setState({
                timerState: this.TIMER_STATES.PAUSED,
              });
            }}
          >
            <Text style={styles.timerButtonText}>
              Pause
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (
      this.state.timerState === this.TIMER_STATES.PAUSED
    ) {
      return (
        <View style={styles.timerButtonSection}>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              this.setState({
                timerState: this.TIMER_STATES.SET,
                timerKey: this.state.timerKey + 1,
              });
            }}
          >
            <Text style={styles.timerButtonText}>
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              this.setState({
                timerState: this.TIMER_STATES.COUNTING,
              });
            }}
          >
            <Text style={styles.timerButtonText}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.timerState === this.TIMER_STATES.END) {
      return (
        <View style={styles.timerButtonSection}>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              this.setState({
                timerState: this.TIMER_STATES.SET,
                timerKey: this.state.timerKey + 1,
              });
            }}
          >
            <Text style={styles.timerButtonText}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  reformatTime(seconds) {
    return `${
      Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0")
      }:${
      Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0")
      }:${
      (seconds % 60)
        .toString()
        .padStart(2, "0")
      }`;
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <Text style={styles.title} >
        </Text>
        <TouchableOpacity
          onPress={() => {
            const { 
              timerHours, 
              timerMinutes, 
              timerSeconds 
            } = this.state;

            this.modalRef.show({
              timerHours,
              timerMinutes,
              timerSeconds
            });
          }}
        >
          <CountdownCircleTimer
            key={this.state.timerKey}
            size={240}
            isPlaying={
              this.state.timerState ===
              this.TIMER_STATES.COUNTING
            }
            strokeLinecap={"round"}
            duration={
              this.state.timerHours * 3600 +
              this.state.timerMinutes * 60 +
              this.state.timerSeconds
            }
            colors={"orchid"}
            onComplete={() => {
              global.device.write("fire\r");
            }}
          >
            {({ remainingTime, color }) => (
              <Text style={{ color, fontSize: 64 }}>
                {this.reformatTime(remainingTime)}
              </Text>
            )}
          </CountdownCircleTimer>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
        {this.renderButtons()}
        <SetTimeModal
          ref={ref => {this.modalRef = ref}}
          onSave={({timerHours, timerMinutes, timerSeconds}) => {
            this.setState({
              timerHours,
              timerMinutes,
              timerSeconds,
            });
          }}
        />
      </View>
    );
  }
}

class SetTimeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      timerHours: "00",
      timerMinutes: "01",
      timerSeconds: "00",
    }
  }

  show({timerHours, timerMinutes, timerSeconds}) {
    this.setState({
      visible: true,
      timerHours: timerHours.toString().padStart(2, "0"),
      timerMinutes: timerMinutes.toString().padStart(2, "0"),
      timerSeconds: timerSeconds.toString().padStart(2, "0"),
    });
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        animationType={"fade"}
        transparent={true}
      >
        <View style={modal.wrap}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              this.setState({ visible: false });
            }}
          >
            <View style={modal.background} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={modal.container}>
              <Text style={modal.headerText}>
                Timer Duration
              </Text>


              <View style={modal.inputSection}>
                <View style={modal.inputWrap}>
                  <TextInput
                    style={modal.input}
                    cursorColor={"orchid"}
                    maxLength={2}
                    selection={{start: 2, end: 2}}
                    keyboardType={"numeric"}
                    onChangeText={(timerHours) => {
                      timerHours = timerHours.replace(/\D/g, '');
                      this.setState({timerHours});
                    }}
                    value={this.state.timerHours}
                    onEndEditing={() => {
                      if (this.state.timerHours.length < 2) {
                        this.setState({
                          timerHours: this.state.timerHours.padStart(2, "0"),
                        });
                      }
                    }}
                  />
                  <Text style={modal.inputLabel}>
                    hh
                  </Text>
                </View>

                <Text style={modal.inputSeparator}>
                  :
                </Text>

                <View style={modal.inputWrap}>
                  <TextInput
                    style={modal.input}
                    cursorColor={"orchid"}
                    maxLength={2}
                    selection={{start: 2, end: 2}}
                    keyboardType={"numeric"}
                    onChangeText={(timerMinutes) => {
                      timerMinutes = timerMinutes.replace(/\D/g, '');
                      this.setState({timerMinutes});
                    }}
                    value={this.state.timerMinutes}
                    onEndEditing={() => {
                      if (this.state.timerMinutes.length < 2) {
                        this.setState({
                          timerMinutes: this.state.timerMinutes.padStart(2, "0"),
                        });
                      }
                    }}
                  />
                  <Text style={modal.inputLabel}>
                    mm
                  </Text>
                </View>

                <Text style={modal.inputSeparator}>
                  :
                </Text>

                <View style={modal.inputWrap}>
                  <TextInput
                    style={modal.input}
                    cursorColor={"orchid"}
                    maxLength={2}
                    selection={{start: 2, end: 2}}
                    keyboardType={"numeric"}
                    onChangeText={(timerSeconds) => {
                      timerSeconds = timerSeconds.replace(/\D/g, '');
                      this.setState({timerSeconds});
                    }}
                    value={this.state.timerSeconds}
                    onEndEditing={() => {
                      if (this.state.timerSeconds.length < 2) {
                        this.setState({
                          timerSeconds: this.state.timerSeconds.padStart(2, "0"),
                        });
                      }
                    }}
                  />
                  <Text style={modal.inputLabel}>
                    ss
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={modal.setButton}
                onPress={() => {
                  this.props.onSave(
                    {
                      timerHours: parseInt(this.state.timerHours),
                      timerMinutes: parseInt(this.state.timerMinutes),
                      timerSeconds: parseInt(this.state.timerSeconds),
                    }
                  )
                  this.setState({
                    visible: false,
                  });
                }}
              >
                <Text style={modal.setButtonText}>
                  Set Timer
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    paddingTop: 20,
    paddingBottom: 35,
    textAlign: "center",
    fontSize: 48,
    color: "grey"
  },
  timerText: {
    fontSize: 32,
  },
  timerButtonSection: {
    width: "80%",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  timerButton: {
    margin: 10,
    marginTop: 20,
    padding: 9,
    width: '40%',
    borderRadius: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orchid",
    elevation: 5,
  },
  timerButtonText: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 24,
    color: "white",
  },
});

const modal = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    height: "100%",
    width: "100%",
    backgroundColor: "darkgrey",
    opacity: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    position: "absolute",
    padding: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 30,
  },
  headerText: {
    marginBottom: 20,
    fontSize: 32,
    textAlign: "center",
    color: "grey",
  },
  inputSection: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputWrap: {
    alignItems: "center",
  },
  input: {
    width: 48,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 32,
    color: "grey",
    borderRadius: 6,
    elevation: 6,
  },
  inputLabel: {
    fontSize: 24,
    color: "orchid",
  },
  inputSeparator: {
    fontSize: 32,
    color: "grey",
    fontWeight: "bold",
    bottom: 15, // this is cheating but i'm in a hurry
  },
  setButton: {
    margin: 10,
    marginTop: 20,
    padding: 9,
    width: '70%',
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: "orchid",
    elevation: 5,
  },
  setButtonText: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 24,
    color: "white",
  },
});
