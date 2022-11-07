import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
// import firebase from 'firebase';
// import firestore from 'firebase';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        avatar: '',
        name: '',
      },
      loggedInText: 'Please wait, you are getting logged in',
    }

  const firebaseConfig = {
    apiKey: "AIzaSyDvRIyE8tZNhAnRFVeiWexxg3uiqJ90cMA",
    authDomain: "chat-app-8a8d2.firebaseapp.com",
    projectId: "chat-app-8a8d2",
    storageBucket: "chat-app-8a8d2.appspot.com",
    messagingSenderId: "620602449240",
    appId: "1:620602449240:web:539ea09fca9ed39f72192d",
    measurementId: "G-0JSN13M5XZ"
  };
  
  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }
  
  this.referenceChatMessages = firebase.firestore().collection("messages");
}

onCollectionUpdate = (querySnapshot) => {
  const messages = [];
  // go through each document
  querySnapshot.forEach((doc) => {
  // get the QueryDocumentSnapshot's data
  let data = doc.data();
  messages.push({
    _id: data._id,
    text: data.text,
    createdAt: data.createdAt.toDate(),
    user: {
      _id: data.user._id,
      name: data.user.name,
      avatar: data.user.avatar || '',
    }
    });
  });
  this.setState({
    messages,
  });
}

addMessage = () => {
  const message = this.state.messages[0];
  this.referenceChatMessages.add({
    uid: this.state.uid,
    _id: message._id,
    text: message.text || '',
    createdAt: message.createdAt,
    user: message.user,
  });
}

onSend(messages = []) {
  this.setState((previousState) => ({
     messages: GiftedChat.append(previousState.messages, messages),
     }),() => {
       this.addMessage();
    });
} 

renderBubble(props) {
   return (
    <Bubble
      {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#A0D995'
          },
          right: {
            backgroundColor: '#4CACBC'
          }
        }}
    />
  )
}

render() {
    let color = this.props.route.params.color;
    let name = this.props.route.params.name;
    return (
        <View style={{ flex: 1, backgroundColor: color, }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: name,
        }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
        </View>
    );
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    // creating a references to messages collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async(user) => {
      if (!user) {
        await
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        }
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
    }

    componentWillUnmount() {
      this.unsubscribe();
      // stop listening to authentication
      this.authUnsubscribe();
    }
}