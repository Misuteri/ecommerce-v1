import axios from 'axios';

// Configuration de base d'axios
const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs globalement
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Request error:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance; 