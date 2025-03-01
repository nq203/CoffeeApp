import { GestureHandlerRootView } from "react-native-gesture-handler";
import Router from "./router";
import "../global.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
export default function Index() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <Router />
      </GestureHandlerRootView>
    </Provider>
  );
}
