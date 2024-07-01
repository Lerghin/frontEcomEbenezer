// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAqZ83eQBs4lJQe5c07Z9Zu_NACSK53HY8",
    authDomain: "ecommerceebenezer-81997.firebaseapp.com",
    projectId: "ecommerceebenezer-81997",
    storageBucket: "ecommerceebenezer-81997.appspot.com",
    messagingSenderId: "508809627247",
    appId: "1:508809627247:web:b4d0c95ca76f558c3caf9a"
};

// Inicializa Firebase
const appFirebase = initializeApp(firebaseConfig);

// Obtén una instancia de Firebase Storage
const storage = getStorage(appFirebase);

// Exporta `storage` para usarlo en otros archivos
export { storage };