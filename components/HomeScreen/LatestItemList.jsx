import { View, Text, FlatList } from "react-native";
import "../../global.css";
import { useEffect } from "react";
import PostItem from "./PostItem";

export default function LatestItemList({ latestItemList, heading, isComprado }) {
  useEffect(() => {
    latestItemList.forEach((item, index) => {
      console.log(`Imageeeem ${index}:`, item.imageBase64?.substring(0, 100) + '...');
      console.log(`tituloooo ${index}:`, item.title);
    });
  }, [latestItemList]);


  return (
    <View className="mt-3">
      <Text className="font-bold text-[20px]"> {[heading]} </Text>
      <FlatList
        data={latestItemList}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PostItem item={item} isComprado={isComprado} />
        )}
      />
    </View>
  );
}
