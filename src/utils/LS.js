export const LS = {
   getText: (key) => localStorage.getItem(key),
 
   getObject: (key) => {
     const item = localStorage.getItem(key);
     try {
       return JSON.parse(item);
     } catch (error) {
       return null; // O manejar el error de otra manera si prefieres
     }
   },
 
   rm: (key) => localStorage.removeItem(key),
 
   set: (key, value) => {
     if (typeof value === "object") {
       localStorage.setItem(key, JSON.stringify(value));
     } else {
       localStorage.setItem(key, value);
     }
   },
 
   clear: () => localStorage.clear()
 };
 