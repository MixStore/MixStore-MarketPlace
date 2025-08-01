// constants/colors.js
const coffeeTheme = {
    primary: "#8B593E",
    background: "#FFF8F3",
    darkBackground: "#d5cdc7",
    text: "#4A3428",
    border: "#E5D3B7",
    white: "#FFFFFF",
    textLight: "#9A8478",
    expense: "#E74C3C",
    income: "#2ECC71",
    card: "#FFFFFF",
    shadow: "#000000",
  };
  
  const forestTheme = {
    primary: "#2E7D32",
    background: "#E8F5E9",
    text: "#1B5E20",
    border: "#C8E6C9",
    white: "#FFFFFF",
    textLight: "#66BB6A",
    expense: "#C62828",
    income: "#388E3C",
    card: "#FFFFFF",
    shadow: "#000000",
  };
  
  const purpleTheme = {
    primary: "#6A1B9A",
    background: "#F3E5F5",
    text: "#4A148C",
    border: "#D1C4E9",
    white: "#FFFFFF",
    textLight: "#BA68C8",
    expense: "#D32F2F",
    income: "#388E3C",
    card: "#FFFFFF",
    shadow: "#000000",
  };
  
  const oceanTheme = {
    primary: "#0277BD",
    background: "#E1F5FE",
    text: "#01579B",
    border: "#B3E5FC",
    white: "#FFFFFF",
    textLight: "#4FC3F7",
    expense: "#EF5350",
    income: "#26A69A",
    card: "#FFFFFF",
    shadow: "#000000",
  };

  
const yellowTheme = {
  primary: "#FBC02D",       // Amarelo vibrante
  background: "#FFFDE7",    // Amarelo bem claro
  text: "#795548",          // Marrom suave para contraste
  border: "#FFECB3",        // Amarelo pastel
  white: "#FFFFFF",
  textLight: "#FFD54F",     // Amarelo claro
  expense: "#F44336",       // Vermelho para despesas
  income: "#43A047",        // Verde para receitas
  card: "#FFFFFF",
  shadow: "#000000",
};

const sunsetTheme = {
  primary: "#FF7043",
  background: "#FFF3E0",
  text: "#BF360C",
  border: "#FFCCBC",
  white: "#FFFFFF",
  textLight: "#FFAB91",
  expense: "#D84315",
  income: "#43A047",
  card: "#FFFFFF",
  shadow: "#000000",
};

const midnightTheme = {
  primary: "#212121",
  background: "#121212",
  text: "#E0E0E0",
  border: "#424242",
  white: "#FFFFFF",
  textLight: "#9E9E9E",
  expense: "#EF5350",
  income: "#66BB6A",
  card: "#1E1E1E",
  shadow: "#000000",
};

const iceTheme = {
  primary: "#00ACC1",
  background: "#E0F7FA",
  text: "#006064",
  border: "#B2EBF2",
  white: "#FFFFFF",
  textLight: "#4DD0E1",
  expense: "#E57373",
  income: "#81C784",
  card: "#FFFFFF",
  shadow: "#000000",
};

const blossomTheme = {
  primary: "#EC407A",
  background: "#FCE4EC",
  text: "#880E4F",
  border: "#F8BBD0",
  white: "#FFFFFF",
  textLight: "#F48FB1",
  expense: "#D32F2F",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const cosmicTheme = {
  primary: "#7E57C2",
  background: "#EDE7F6",
  text: "#4527A0",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#B39DDB",
  expense: "#E53935",
  income: "#43A047",
  card: "#FFFFFF",
  shadow: "#000000",
};




  
  export const THEMES = {
    coffee: coffeeTheme,
    forest: forestTheme,
    purple: purpleTheme,
    ocean: oceanTheme,
    yellow: yellowTheme,
    sunset: sunsetTheme,
    midnight: midnightTheme,
    ice: iceTheme,
    blossom: blossomTheme,
    cosmic: cosmicTheme,
  };


  
  // 👇 change this to switch theme
  export const COLORS = THEMES.coffee;