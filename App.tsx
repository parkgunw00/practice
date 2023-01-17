import { StyleSheet, Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, reverseGeocodeAsync } from "expo-location";
import axios from "axios";

const API_KEY = "12af8ce0f9c6d4b96b8dd3ca1ad7bd25";

export default function App() {
  const [permission, setPermission] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [city, setCity] = useState<string|null>("");
  const [weather,setWeather]=useState<string>("");
  const [temperature, setTemperature] = useState<number>(100);
  const [feelsLike,setfeelsLike] = useState<number>(100);
  const [humidity,setHumidity] = useState<number>(100);
  const [pressure,setPressure] = useState<number>(100);
  const [windSpeed,setwindSpeed] = useState<number>(100);

  

  const getPermission = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("위치 정보를 허용해주세요...");
      return;
    } else {
      setPermission(true);
    }
  };

  const getLocation = async () => {
    const location = await getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;
    setLocation(location.coords);
    await reverseGeocodeAsync({ latitude, longitude }).then((response) => {
      setCity(response[0].region);
    });
  }

  const getWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`);     
      
      console.log(response.data.Date);

      setWeather(response.data.weather[0].description);
      setTemperature(response.data.main.temp)
      setfeelsLike(response.data.main.feels_like)
      setHumidity(response.data.main.humidity)
      setPressure(response.data.main.pressure)
      setwindSpeed(response.data.wind.speed)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPermission();
  }, []);

  useEffect(() => {
    if (permission) {
      getLocation();
    }
  }, [permission]);

  useEffect(() => {
    if (location) {
      getWeatherData();
    }
  }, [location]);


  if (!permission) return null;
  else {
    return (
      <View style={styles.container}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.city}>{weather}</Text>
        <Text style={styles.city}>{temperature}</Text>
        <Text style={styles.city}>{feelsLike}</Text>
        <Text style={styles.city}>{humidity}</Text>
        <Text style={styles.city}>{pressure}</Text>
        <Text style={styles.city}>{windSpeed}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  city: {
    color: "black",
    fontSize: 50,

  }
});