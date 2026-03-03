import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export default function DashboardScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => {
      setData(res.data);
      AsyncStorage.setItem("cache", JSON.stringify(res.data));
    });
  }, []);

  return (
    <View>
      {data.map((d) => (
        <Text key={d._id}>{d.name}</Text>
      ))}
    </View>
  );
}