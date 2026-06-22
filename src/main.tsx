import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { Provider } from "react-redux"
import { store } from "./redux/store.ts"
import { CartProvider } from "./context/CartContext" // CartProvider එක import කරන්න

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CartProvider>
        <App />
      </CartProvider>
    </Provider>
  </StrictMode>
)