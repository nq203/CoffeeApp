import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RegisterScreenNavigationProp } from "@/app/router/StackNavigator";
import FormFiled from "./Components/FormFiled";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "./Components/CustomButton";
import { BounceIn } from "react-native-reanimated";
import { registerUser } from "@/Firebase/Services/userService";
type Props = {
  navigation: RegisterScreenNavigationProp;
  route: {
    params: {
      itemId: number;
      otherParam?: string;
    };
  };
};
const RegisterScreen = ({ navigation, route }: Props) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    repassword: "",
  });
  const handleRegister = async () => {
    if (form.email && form.password && form.repassword) {
      if (form.password != form.repassword) {
        Alert.alert("Sai mat khau!");
        return;
      }
      try {
        await registerUser(form.email, form.password);
        // if(data.userId)navigation.navigate('Tabs');
      } catch (error) {
        console.error(error);
        return;
      }

    }
  };
  return (
    <SafeAreaView className="bg-[#F6F1ED] h-full justify-center item-center">
      <ScrollView className="w-full">
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={require("../../../assets/images/logo.jpeg")}
            resizeMode="contain"
            className="w-[100px] h-[100px] rounded-full"
          />
          <Text className="text-2xl font-semibold">Register Account</Text>
          <FormFiled
            title="Email"
            value={form.email}
            placeholder="Hãy nhập email của bạn"
            handleChangeText={(e) => setForm({ ...form, email: e })}
          />
          <FormFiled
            title="Password"
            value={form.password}
            placeholder="Hãy nhập mật khẩu của bạn"
            handleChangeText={(e) => setForm({ ...form, password: e })}
          />
          <FormFiled
            title="Password again"
            value={form.repassword}
            placeholder="Hãy nhập lại mật khẩu của bạn"
            handleChangeText={(e) => setForm({ ...form, repassword: e })}
          />
          <CustomButton
            title="Register"
            handleSubmit={handleRegister}
          ></CustomButton>
          <View className="flex-row justify-center w-full px-4 my-2 mt-5">
            <Text className="px-2 font-semibold text-[#854836]">
              nếu bạn đã có tài khoản?
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text className="font-semibold text-[#543310]">
                Đăng nhập ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
