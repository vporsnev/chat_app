import React, { Component } from "react";
import "react-native-gesture-handler";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import the components
import Start from "./components/Start";
import Chat from "./components/Chat";

// Create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Start">
					<Stack.Screen
						name="Start"
						component={Start}
						options={{
							title: "Chat App",
							headerStyle: {
								height: 0,
							},
						}}
					/>
					<Stack.Screen
						name="Chat"
						component={Chat}
						options={{
							title: "My home",
							headerStyle: {
								backgroundColor: "#D8D9CF",
								height: 80,
							},
							headerTintColor: "#000",
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
