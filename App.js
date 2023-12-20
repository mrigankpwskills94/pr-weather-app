import axios from "axios";
import * as Location from "expo-location";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default function App() {
    const [location, setLocation] = useState(""); // State to hold the user-entered location
    const [weatherData, setWeatherData] = useState(null); // State to hold weather data for the entered location
    const [currentLocationWeatherData, setCurrentLocationWeatherData] =
        useState(null); // State to hold weather data for the current location
    const API_KEY = "b49d485749mshab1bcba4baf0c9ap114f5ejsn9ed3298ece68"; // Replace with your actual API key
    const WeatherInfo = ({ location, temp_c, condition }) => (
        <View style={styles.weatherContainer}>
            <Text style={styles.weatherText}>Location: {location}</Text>
            <Text style={styles.weatherText}>Temperature: {temp_c} °C</Text>
            <Text style={styles.weatherText}>Weather: {condition}</Text>
        </View>
    );
    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(
                `<https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`,
                {
                    headers: {
                        "x-rapidapi-key": API_KEY,
                        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
                    },
                }
            );
            setWeatherData(response.data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeatherData(null);
        }
    };
    const fetchWeatherDataByLocation = async (latitude, longitude) => {
        try {
            // Update the weather API request URL with the latitude and longitude
            const response = await axios.get(
                `<https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`,
                {
                    headers: {
                        "x-rapidapi-key": API_KEY,
                        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
                    },
                }
            );
            setCurrentLocationWeatherData(response.data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setCurrentLocationWeatherData(null);
        }
    };
    const getCurrentLocationAndFetchWeather = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.log("Please grant location permissions");
            return;
        }

        try {
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            const { latitude, longitude } = currentLocation.coords;
            fetchWeatherDataByLocation(latitude, longitude);
        } catch (error) {
            console.error("Error getting current location:", error);
        }
    };
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter location"
                value={location}
                onChangeText={setLocation}
            />

            <TouchableOpacity
                style={[styles.button, !location && styles.disabledButton]}
                onPress={fetchWeatherData}
                disabled={!location}>
                <Text style={styles.buttonText}>Get Weather</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={getCurrentLocationAndFetchWeather}>
                <Text style={styles.buttonText}>
                    Get Weather for Current Location
                </Text>
            </TouchableOpacity>
            {/* Display weather information for the entered location */}
            {weatherData && (
                <WeatherInfo
                    location={weatherData.location.name}
                    temp_c={weatherData.current.temp_c}
                    condition={weatherData.current.condition.text}
                />
            )}

            {/* Display weather information for the current location */}
            {currentLocationWeatherData && (
                <View style={styles.currentLocationWeatherContainer}>
                    <WeatherInfo
                        location={currentLocationWeatherData?.location?.name}
                        temp_c={currentLocationWeatherData.current.temp_c}
                        condition={
                            currentLocationWeatherData.current.condition.text
                        }
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    weatherContainer: {
        alignItems: "center",
    },

    // Styling for weather information text
    weatherText: {
        fontSize: 18,
        marginBottom: 10,
    },

    // Styling for input field
    input: {
        width: "80%",
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 20,
    },

    // Styling for buttons
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },

    // Styling for button text
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
});
