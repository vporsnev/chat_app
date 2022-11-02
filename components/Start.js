import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

// Define colors for background color selection
const backgroundColors = {
  black: '#090C08',
  purple: '#474056',
  grey: '#8A95A5',
  green: '#B9C6AE',
};

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: '' };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/background-image.png')}
          style={styles.image}
        >
          <Text style={styles.title}>Chat App</Text>
          <View style={styles.startBox}>
            <TextInput
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name"
            />
            <View style={styles.colorBox}>
              <Text style={styles.colorText}>Choose Background Color:</Text>
              <View style={styles.colors}>
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.black },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.black })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.purple },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.purple })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.grey },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.grey })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.green },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.green })
                  }
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: '15%',
  },

  startBox: {
    marginTop: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 300,
    width: 300,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '6%',
  },

  input: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    height: 50,
    width: 250,
    borderColor: 'lightgrey',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },

  colorBox: {
    width: 250,
    justifyContent: 'center',
  },

  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    textAlign: 'center',
  },

  colors: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 20,
    marginRight: 25,
  },

  button: {
    height: 50,
    width: 250,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#937DC2',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});