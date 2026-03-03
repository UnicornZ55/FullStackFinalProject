import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "./api"

export const syncQueue = async()=>{
 const queue = JSON.parse(await AsyncStorage.getItem("queue")||"[]")

 for(const item of queue){
  await api.post("/orders", item)
 }

 await AsyncStorage.removeItem("queue")
}