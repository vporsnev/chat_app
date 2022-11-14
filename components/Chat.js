import React from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import MapView from "react-native-maps";
// import firebase from 'firebase';
// import firestore from 'firebase';

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			uid: 0,
			user: {
				_id: "",
				avatar: "",
				name: "",
			},
			image: null,
			location: null,
			isConnected: false,
		};

		// Firebase configuration
		const firebaseConfig = {
			apiKey: "AIzaSyDvRIyE8tZNhAnRFVeiWexxg3uiqJ90cMA",
			authDomain: "chat-app-8a8d2.firebaseapp.com",
			projectId: "chat-app-8a8d2",
			storageBucket: "chat-app-8a8d2.appspot.com",
			messagingSenderId: "620602449240",
			appId: "1:620602449240:web:539ea09fca9ed39f72192d",
			measurementId: "G-0JSN13M5XZ",
		};

		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}

		this.referenceChatMessages = firebase.firestore().collection("messages");
	}

	// get stored images
	async getMessages() {
		let messages = "";
		try {
			messages = (await AsyncStorage.getItem("messages")) || [];
			this.setState({
				messages: JSON.parse(messages),
			});
		} catch (error) {
			console.log(error.message);
		}
	}
	// store message
	async saveMessages() {
		try {
			await AsyncStorage.setItem(
				"messages",
				JSON.stringify(this.state.messages)
			);
		} catch (error) {
			console.log(error.message);
		}
	}

	async deleteMessages() {
		try {
			await AsyncStorage.removeItem("messages");
			this.setState({
				messages: [],
			});
		} catch (error) {
			console.log(error.message);
		}
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
					avatar: data.user.avatar || "",
				},
				image: data.image || null,
				location: data.location || null,
			});
		});
		this.setState({
			messages,
		});
	};

	// Add message to Firestore
	addMessage = () => {
		const message = this.state.messages[0];
		this.referenceChatMessages.add({
			uid: this.state.uid,
			_id: message._id,
			text: message.text || "",
			createdAt: message.createdAt,
			user: message.user,
			image: message.image || null,
			location: message.location || null,
		});
	};

	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessage();
				this.saveMessages();
			}
		);
	}

	renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
			return <InputToolbar {...props} />;
		}
	}

	renderCustomActions = (props) => {
		return <CustomActions {...props} />;
	};

	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					left: {
						backgroundColor: "#A0D995",
					},
					right: {
						backgroundColor: "#4CACBC",
					},
				}}
			/>
		);
	}

	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	}

	render() {
		let color = this.props.route.params.color;
		let name = this.props.route.params.name;
		return (
			<ActionSheetProvider>
				<View style={{ flex: 1, backgroundColor: color }}>
					<GiftedChat
						renderBubble={this.renderBubble.bind(this)}
						messages={this.state.messages}
						renderInputToolbar={this.renderInputToolbar.bind(this)}
						onSend={(messages) => this.onSend(messages)}
						user={{
							_id: this.state.user._id,
							name: name,
						}}
						renderActions={this.renderCustomActions.bind(this)}
						renderCustomView={this.renderCustomView.bind(this)}
					/>
					{Platform.OS === "android" ? (
						<KeyboardAvoidingView behavior="height" />
					) : null}
				</View>
			</ActionSheetProvider>
		);
	}

	componentDidMount() {
		let name = this.props.route.params.name;
		this.props.navigation.setOptions({ title: name });

		NetInfo.fetch().then((connection) => {
			if (connection.isConnected) {
				this.setState({ isConnected: true });
				console.log("online");

				this.referenceChatMessages = firebase
					.firestore()
					.collection("messages");

				this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
					if (!user) {
						firebase.auth().signInAnonymously();
					}
					this.setState({
						uid: user.uid,
						messages: [],
						user: {
							_id: user.uid,
							name: name,
						},
					});
					this.unsubscribe = this.referenceChatMessages
						.orderBy("createdAt", "desc")
						.onSnapshot(this.onCollectionUpdate);
				});
			} else {
				this.setState({ isConnected: false });
				console.log("offline");

				this.getMessages();
			}
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
		// stop listening to authentication
		this.authUnsubscribe();
	}
}
