import React, { Component } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Svg, { Line } from "react-native-svg";

/* lmfao this shit literally doesn't work fuck it */
export class Alarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "hours",
      alarmHour: 8,
      alarmMinute: 0,
    }
  }

  async componentDidMount() {
    let {
      alarmHour,
      alarmMinute,
    } = {alarmHour: 8, alarmMinute: 0};

    this.setState({
      alarmHour,
      alarmMinute,
    });
  }

  renderClock = () => {
    const hours = new Array(12).fill(null).map((_, idx) => {
      let angle = 2 * Math.PI * idx / 12;
      let left = 120 + (100 * Math.sin(angle));
      let top = 120 + (-100 * Math.cos(angle));
      return (
        <TouchableOpacity
          style={[
            styles.clockButton,
            {
              backgroundColor:
                idx === this.state.alarmHour % 12 ?
                  "orchid" : "#efefef",
              left,
              top,
            }
          ]}

          key={idx}
          onPress={() => {
            this.setState({
              alarmHour: idx + (this.state.notifAmpm ? 12 : 0),
            })
          }}
        >
          <Text
            style={[
              styles.clockButtonText,
              {
                color:
                  idx === this.state.alarmHour % 12 ?
                    "#fff" : "grey",
              }
            ]}
          >
            {idx || 12}
          </Text>
        </TouchableOpacity>
      ); });

    const minutes = new Array(12).fill(null).map((_, idx) => {
      let angle = 2 * Math.PI * idx / 12;
      let left = 120 + (100 * Math.sin(angle));
      let top = 120 + (-100 * Math.cos(angle));
      return (
        <TouchableOpacity
          style={[
            styles.clockButton,
            {
              backgroundColor:
                idx * 5 === this.state.alarmMinute ?
                  "orchid" : "#efefef",
              left,
              top,
            }
          ]}

          key={idx}
          onPress={() => {
            this.setState({
              alarmMinute: idx * 5,
            })
          }}
        >
          <Text
            style={[
              styles.clockButtonText,
              {
                color:
                  idx * 5 === this.state.alarmMinute ?
                    "#fff" : "grey",
              }
            ]}
          >
            {(idx * 5).toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      );
    });

    const angle = (this.state.mode === "hours" ?
      this.state.alarmHour :
      this.state.alarmMinute / 5
    ) * 2 * Math.PI / 12;

    const x2 = 140 + (80 * Math.sin(angle));
    const y2 = 140 + (-80 * Math.cos(angle));

    const arm = () => (
      <Svg
        height="240"
        width="240"
        style={styles.clockArm}
      >
        <Line
          x1={140}
          y1={140}
          x2={x2}
          y2={y2}
          stroke={"orchid"}
          strokeWidth={3}
        />
      </Svg>
    )

    return (
      <View style={styles.clockBackground}>
        {arm()}
        {this.state.mode === "hours" ? hours : minutes}
        <View style={styles.clockCenter}/>
      </View>
    );
  }

  renderNotifTime = () => {
    return (
      <View style={styles.notifTimeWrap}>
        <Text
          style={[
            styles.notifTimeText,
            {
              color:
                this.state.mode === "hours" ?
                  "orchid" : "grey",
            }
          ]}
          onPress={() => {
            this.setState({
              mode: "hours",
            });
          }}
        >
          {(this.state.alarmHour % 12 || 12).toString().padStart(2, '0')}
        </Text>
        <Text style={[styles.notifTimeText, {paddingBottom: 25}]}>
          :
        </Text>
        <Text
          style={[
            styles.notifTimeText,
            {
              color:
                this.state.mode === "minutes" ?
                  "orchid" : "grey",
            }
          ]}
          onPress={() => {
            this.setState({
              mode: "minutes",
            });
          }}
        >
          {this.state.alarmMinute.toString().padStart(2, '0')}
        </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            let notifAmpm = !this.state.notifAmpm;
            let alarmHour = this.state.alarmHour + (notifAmpm ? 12 : -12);
            this.setState({
              notifAmpm,
              alarmHour,
            });
          }}
        >
          <View style={styles.ampmWrap}>
            <Text
              style={[
                styles.ampmText,
                {
                  color: this.state.notifAmpm ?
                    "grey" : "orchid",
                }
              ]}
            >
              AM
            </Text>
            <Text
              style={[
                styles.ampmText,
                {
                  color: this.state.notifAmpm ?
                    "orchid" : "grey",
                }
              ]}
            >
              PM
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{alignItems: "center"}}
      >
        <Text style={styles.title}>
        </Text>
        {this.renderClock()}
        {this.renderNotifTime()}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => this.saveSettings()}
        >
          <Text style={styles.saveButtonText}>
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    paddingTop: 20,
    paddingBottom: 15,
    textAlign: "center",
    fontSize: 48,
    color: "grey"
  },
  clockButton: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#efefef",
    borderRadius: 40,
  },
  clockButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  clockArm: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  clockBackground: {
    width: 280,
    height: 280,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#efefef",
    borderRadius: 280,
  },
  clockCenter: {
    width: 8,
    height: 8,
    backgroundColor: "orchid",
    borderRadius: 8,
  },
  notifTimeWrap: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  notifTimeText: {
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 60,
    color: "grey",
  },
  ampmWrap: {
    paddingLeft: 12,
    paddingTop: 6,
  },
  ampmText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    margin: 10,
    marginTop: 20,
    padding: 9,
    width: '80%',
    backgroundColor: "orchid",
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 5,
  },
  saveButtonText: {
    alignSelf: "center",
    fontSize: 24,
    color: "white",
  },
});
