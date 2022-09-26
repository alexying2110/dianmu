import React, {Component} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Material from '@expo/vector-icons/MaterialIcons';

import RNBluetoothClassic, {
  BluetoothDevice
} from 'react-native-bluetooth-classic';

export class Connections extends Component {
  constructor(props) {
    super(props);
    this.readSub = null;
    /* there should probably be an enum here but goddamn that's too much work */
    this.state = {
      enabled: false,
      connected: "Attempting to connect...",
      //connected: "Not connected",
      //connected: "Connected",
    }
  }

  async componentDidMount() {
    try {
      await this.checkPermissions();
    } catch (e) {
      console.log(e);
    }

    if (this.state.enabled) {
      try {
        let connectionPromise = this.connect();
        let timeoutPromise = new Promise((res, rej) => setTimeout(() => res(false), 5000));
        let res = await Promise.race([connectionPromise, timeoutPromise]);
        console.log(res);
        if (!res) {
          this.setState({
            connected: "Not connected",
          });
        }

      } catch (e) {
        console.log(e);
      }
    } else {
      this.setState({
        connected: "Enable Bluetooth to use app"
      });
    }
    console.log('finish mount');
  }

  checkPermissions = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    ]);
    let enabled = await RNBluetoothClassic.isBluetoothEnabled();
    this.setState({ enabled });
  }

  async connect() {
    console.log('attempted to connect');
    try {
      let paired = await RNBluetoothClassic.getBondedDevices();
      global.device = await paired.find(item => item.name==="H-C-2010-06-01");
      let connection = await global.device.connect({DELIMITER: "\r"});
      const connected = await RNBluetoothClassic.getConnectedDevices();
      if (connected) {
        console.log('here');
        console.log(connected);
        this.readSub = global.device.onDataReceived(({ data }) => {
          console.log("response: ", data);
          if (data === "ACK") {
            this.setState({
              connected: "Connected"
            });
          }
        });
        console.log('writing');
        await global.device.write("ENQ\r");
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  renderIcon = () => {
    if (this.state.connected === "Not connected" || this.state.connected === "Enable Bluetooth to use app") {
      return (
        <Material
          name={"bluetooth-disabled"}
          color={"orchid"}
          size={120}
        />
      )
    } else if (this.state.connected === "Attempting to connect...") {
      return (
        <ActivityIndicator
          size={80}
          color={"orchid"}
        />
      )
    } else {
      return (
        <Material
          name={"bluetooth-connected"}
          color={"orchid"}
          size={120}
        />
      )
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.indicatorWrap}>
          {this.renderIcon()}
        </View>
        <Text style={[styles.connectionStatus]}>
          {this.state.connected}
        </Text>
        { (
            this.state.connected === "Not connected" ||
            this.state.connected === "Enable Bluetooth to use app"
            
          ) &&
          (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={async () => {
                console.log('here');
                try {
                  await this.checkPermissions();
                  if (!this.state.enabled) {
                    this.setState({
                      connected: "Enable Bluetooth to use app"
                    });
                  }
                  this.setState({
                    connected: "Attempting to connect..."
                  });
                  let connectionPromise = this.connect();
                  let timeoutPromise = new Promise((res, rej) => setTimeout(() => res(false), 5000));
                  let res = await Promise.race([connectionPromise, timeoutPromise]);
                  if (!res) {
                    this.setState({
                      connected: "Not connected",
                    });
                  }

                } catch (e) {
                  console.log(e);
                }
              }}
            >
              <Text style={styles.retryButtonText}>
                Retry
              </Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  indicatorWrap: {
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "orchid",
    borderWidth: 3,
    borderRadius: 240,
  },
  connectionStatus: {
    marginTop: 50,
    fontSize: 36,
    color: "orchid",
    textAlign: "center",
  },
  retryButton: {
    width: 120,
    height: 60,
    marginTop: 50,
    backgroundColor: "orchid",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    elevation: 5,
  },
  retryButtonText: {
    fontSize: 24,
    color: "white",
  },
});
