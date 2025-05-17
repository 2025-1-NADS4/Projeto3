// src/utils/geocode.js
export const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
        // Opcional: configure 'User-Agent' se necessário
      }
    });
    const data = await response.json();
  
    if (data && data.length > 0) {
      // Retorna as coordenadas do primeiro resultado
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } else {
      throw new Error('Endereço não encontrado');
    }
  };
  