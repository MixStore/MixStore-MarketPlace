import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TopBarNavigationComponent(props) {
  const navigation = useNavigation();
  const { title = 'MixStore', onMenuPress, onCartPress } = props;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md border-b border-gray-200">
      <TouchableOpacity onPress={onMenuPress} className="p-2">
        <Ionicons name='home' size={24} color="#333" />
      </TouchableOpacity>

      <Text className="text-lg font-bold text-gray-800">{title}</Text>

      <TouchableOpacity onPress={onCartPress} className="p-2">
      <Ionicons name='home' size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}


