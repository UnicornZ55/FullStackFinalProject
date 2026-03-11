import { useState } from "react";
import { View, Text, Image, Pressable, Alert, StyleSheet } from "react-native";

const PROFILE_IMAGE_URL = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80";

export default function HomeScreen() {
  const [borderColor, setBorderColor] = useState("#2b6cb0");

  const handlePress = (platform) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setBorderColor(randomColor);

    Alert.alert(`You pressed ${platform}`, `Platform: ${platform}`, [{ text: "OK" }]);
  };

  const buttons = [
    { label: "GitHub", color: "#24292e" },
    { label: "Facebook", color: "#1877f2" },
    { label: "Instagram", color: "#c32aa3" },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.profileWrapper, { borderColor }]}> 
        <Image source={{ uri: PROFILE_IMAGE_URL }} style={styles.profileImage} />
      </View>
      <Text style={styles.name}>Your Name</Text>
      <Text style={styles.subtitle}>Link-in-Bio Demo</Text>

      <View style={styles.buttons}>
        {buttons.map((btn) => (
          <Pressable
            key={btn.label}
            onPress={() => handlePress(btn.label)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? "#222" : btn.color },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.buttonText}>{btn.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f3f4f6",
  },
  profileWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 24,
  },
  buttons: {
    width: "100%",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
