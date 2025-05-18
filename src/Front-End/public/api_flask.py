from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import joblib
import json
import os
import requests
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)  # Libera o CORS para permitir requisições do frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Função para preprocessar dados e treinar modelos
def preprocess_and_train():
    with open('dadostratados.json', encoding='utf-8') as f:
        dados = json.load(f)

    for tipo_servico, corridas in dados.items():
        if isinstance(corridas, list):
            df = pd.DataFrame(corridas)
            df.rename(columns={
                'Distancia (km)': 'distancia',
                'price': 'preco',
                'DiaSemana': 'dia_semana'
            }, inplace=True)

            # Conversão de dados
            df['distancia'] = df['distancia'].str.replace('.', '', regex=False).str.replace(',', '.', regex=False).astype(float) / 1000
            df['preco'] = df['preco'].astype(float)

            # Limpa dados inválidos/vazios
            df = df.dropna(subset=['distancia', 'preco', 'dia_semana'])
            df = df[df['dia_semana'].astype(str).str.isnumeric()]
            df['dia_semana'] = df['dia_semana'].astype(int)

            # Define variáveis de entrada e saída
            X = df[['distancia', 'dia_semana']]
            y = df['preco']

            # Treina o modelo
            modelo = LinearRegression()
            modelo.fit(X, y)

            # Salva o modelo
            joblib.dump(modelo, f'modelo_{tipo_servico}.joblib')
            print(f'✅ Modelo treinado e salvo para {tipo_servico}')

# Função para buscar coordenadas
def get_coordinates(address):
    url = f'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=pt-BR&q={address}'
    response = requests.get(url)
    data = response.json()
    if data:
        return float(data[0]['lon']), float(data[0]['lat'])
    return None

# Função para calcular distância via OSRM
def get_driving_distance(origin, destination):
    origin_coords = get_coordinates(origin)
    destination_coords = get_coordinates(destination)

    if origin_coords and destination_coords:
        osrm_url = f'https://router.project-osrm.org/route/v1/driving/{origin_coords[0]},{origin_coords[1]};{destination_coords[0]},{destination_coords[1]}?overview=false'
        response = requests.get(osrm_url)
        data = response.json()
        if 'routes' in data and data['routes']:
            distance = data['routes'][0]['distance'] / 1000  # metros para km
            return round(distance, 2)
    return None

# Preprocessa dados e treina modelos se não existirem
if not any(fname.startswith('modelo_') for fname in os.listdir()):
    preprocess_and_train()

@app.route('/api/estimate_prices', methods=['POST'])
def estimate_prices():
    try:
        data = request.get_json()

        origin = data.get('origin')
        destination = data.get('destination')

        if not origin or not destination:
            return jsonify({'error': 'Origem e destino são obrigatórios.'}), 400

        # Coordenadas e distância
        distance = get_driving_distance(origin, destination)
        if distance is None:
            return jsonify({'error': 'Não foi possível calcular a distância.'}), 500

        # Dia da semana atual (0=segunda, ..., 6=domingo)
        from datetime import datetime
        dia_semana = datetime.now().weekday()

        estimativas = {}

        # Para cada modelo treinado
        for fname in os.listdir():
            if fname.startswith('modelo_') and fname.endswith('.joblib'):
                tipo = fname.replace('modelo_', '').replace('.joblib', '')
                modelo = joblib.load(fname)
                preco_estimado = modelo.predict([[distance, dia_semana]])[0]
                estimativas[tipo] = round(preco_estimado, 2)

        return jsonify({
            'distancia_km': distance,
            'dia_semana': dia_semana,
            'precos_estimados': estimativas
        })

    except Exception as e:
        print(f"Erro na previsão de preços: {e}")
        return jsonify({'error': f"Erro interno: {str(e)}"}), 500


    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # Agora está configurado para aceitar conexões de qualquer IP
