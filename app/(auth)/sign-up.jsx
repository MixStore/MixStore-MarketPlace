import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../util/COLORS';
import { styles } from '../../assets/styles/auth.styles';
import { updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from '../../firebaseConfig';






export default function SignUpScreen() {
  const router = useRouter();
  const { setPendingVerification: pendingParam, email: emailParam, password: passwordParam } = useLocalSearchParams();

  const auth = getAuth();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(pendingParam === 'true');
  const [canResend, setCanResend] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  const db = getFirestore(app);

  function showToast(message, type = 'success') {
    showMessage({
      message,
      type,
      duration: 3000,
      position: 'bottom',
    });
  }
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };


  const uploadToCloudinary = async (uri) => {
    
    const cloudName = 'ddoinvb8m';
    const uploadPreset = 'MixStore'

    try {
      const data = new FormData();
    data.append("upload_preset", uploadPreset); // substitua pelo seu
    data.append("file", uri); // substitua pelo seu
  
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }

    );
  
      const result = await res.json();
  
      if (result.secure_url) {
        return result.secure_url;
      } else {
        console.error("Erro ao obter URL da imagem:", result);
        return null;
      }
    } catch (error) {
      console.error("Erro no upload para Cloudinary:", error);
      return null;
    }
  };
  

const onSignUpPress = async () => {
  if (!fullName || !phone || !emailAddress || !password) {
    setError("Preencha todos os campos obrigatórios.");
    showToast("Preencha todos os campos obrigatórios.", "danger");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password);
    const user = userCredential.user;

    publicUrl = await uploadToCloudinary(profileImage)

    await updateProfile(user, {
      displayName: fullName,
      photoURL: publicUrl || "",
    });

    await sendEmailVerification(user);
    showToast("E-mail de verificação enviado", "success");
    setPendingVerification(true)
    setCanResend(false)
    setCooldown(60)

    // Salvar dados adicionais no Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName,
      phone,
      photoURL: publicUrl || "",
      createdAt: new Date(),
    });

  } catch (err) {
    showToast("Um erro inesperado ocorreu", "danger");
    console.error("Erro ao criar usuário:", err);
  }
};

  

  const onYesPress = () => router.navigate("./sign-in-adm");

  const onNoPress = async () => {
    if (!canResend) return;

    const user = auth.currentUser || (await signInWithEmailAndPassword(auth, emailParam, passwordParam)).user;

    try {
      await sendEmailVerification(user);
      setCanResend(false);
      setCooldown(60);
      showToast("E-mail reenviado", "success");
      await signOut(auth);
    } catch (error) {
      showToast("Um erro inesperado ocorreu", "danger");
      await signOut(auth);
      console.error("Erro ao reenviar e-mail de verificação:", error);
    }
  };

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (pendingVerification) {
    return (
      <View style={[styles.container, stls.container]}>
        <Text style={stls.title}>Recebeu o e-mail?</Text>
        <View style={stls.buttonContainer}>
          <TouchableOpacity style={stls.button} onPress={onYesPress}>
            <Text style={stls.buttonText}>Sim, fazer login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stls.button, stls.noButton, !canResend && { opacity: 0.5 }]}
            onPress={onNoPress}
            disabled={!canResend}
          >
            <Text style={stls.buttonText}>
              {!canResend ? `Aguarde ${cooldown}s` : 'Não, reenviar e-mail'}
            </Text>
          </TouchableOpacity>
        </View>
        <FlashMessage position="bottom" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} extraHeight={100}>
      
<View style={styles.container}>
  <TouchableOpacity onPress={pickImage} style={modern.avatarContainer}>
    {profileImage ? (
      <Image source={{ uri: profileImage }} style={modern.avatar} />
    ) : (
      <View style={modern.avatarPlaceholder}>
        <Ionicons name="camera" size={32} color={COLORS.primary} />
        <Text style={modern.avatarText}>Adicionar foto</Text>
      </View>
    )}
  </TouchableOpacity>

  <View style={modern.form}>
    <View style={modern.inputGroup}>
      <Ionicons name="person" size={20} color={COLORS.primary} style={modern.icon} />
      <TextInput style={modern.input} placeholder="Nome completo*" value={fullName} onChangeText={setFullName} />
    </View>

    <View style={modern.inputGroup}>
      <Ionicons name="call" size={20} color={COLORS.primary} style={modern.icon} />
      <TextInput style={modern.input} placeholder="Telefone*" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
    </View>

    <View style={modern.inputGroup}>
      <Ionicons name="mail" size={20} color={COLORS.primary} style={modern.icon} />
      <TextInput style={modern.input} placeholder="E-mail*" value={emailAddress} onChangeText={setEmailAddress} autoCapitalize="none" />
    </View>

    <View style={modern.inputGroup}>
      <Ionicons name="lock-closed" size={20} color={COLORS.primary} style={modern.icon} />
      <TextInput style={modern.input} placeholder="Senha*" value={password} onChangeText={setPassword} secureTextEntry />
    </View>

    <TouchableOpacity onPress={onSignUpPress} style={modern.submitButton}>
      <Text style={modern.submitText}>Criar conta</Text>
    </TouchableOpacity>

    <View style={modern.footer}>
      <Text style={modern.footerText}>Já possui uma conta?</Text>
      <TouchableOpacity onPress={() => router.navigate("./sign-in")}>
        <Text style={modern.footerLink}>Entre aqui</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

<FlashMessage position="bottom" />
    </KeyboardAwareScrollView>

  );
}

const stls = StyleSheet.create({
  illustration: {
    height: 200,
    width: 640,
    resizeMode: "contain",
  },
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  noButton: {
    backgroundColor: COLORS.expense,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  imagePicker: {
    marginVertical: 16,
    alignItems: 'center',
  },
  imagePickerText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

const modern = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderWidth: 0,
    outlineStyle: 'none',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

