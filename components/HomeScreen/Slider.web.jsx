import React, { useEffect, useRef, useState } from "react";
import { View, Image, ScrollView, Dimensions, TouchableOpacity, Text } from "react-native";

export default function Slider({ sliderList }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(5);
  
  
const screenWidth = Dimensions.get("window").width;
const imageWidth = screenWidth * 0.9; // imagem menor que a tela
const imageHeight = imageWidth * 9 / 16



  // Scroll para o próximo slide
  const scrollToIndex = (index) => {
    scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    setCurrentIndex(index);
    setTimer(5); // reinicia o contador
  };

  // Avança para o próximo
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % sliderList.length;
    scrollToIndex(nextIndex);
  };

  // Volta para o anterior
  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + sliderList.length) % sliderList.length;
    scrollToIndex(prevIndex);
  };

  // Timer de 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          goToNext();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={{ marginTop: 20, position: "relative", alignItems: "center" }}>
      {/* Carrossel */}
      

 
<ScrollView
  ref={scrollRef}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  scrollEnabled={false}
  style={{ width: screenWidth }}
>
  {sliderList.map((item, index) => (
    <View
      key={index}
      style={{
        width: screenWidth, // cada slide ocupa a tela inteira
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        style={{
          width: imageWidth,
          height: imageHeight/2,
          resizeMode: "stretch",
          borderRadius: 10,
          backgroundColor: "#fff", // espaço em branco ao redor
        }}
      />
    </View>
  ))}
</ScrollView>
      {/* Botão Anterior */}
      <TouchableOpacity
        onPress={goToPrev}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: [{ translateY: -20 }],
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 10,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>‹</Text>
      </TouchableOpacity>
      

      {/* Botão Próximo */}
      <TouchableOpacity
        onPress={goToNext}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: [{ translateY: -20 }],
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 10,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>›</Text>
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          bottom: 20,
          backgroundColor: "rgba(0,0,0,0.5)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 8 }}>
          Próxima imagem em {timer}s
        </Text>
      </View>
    </View>
  );
}
