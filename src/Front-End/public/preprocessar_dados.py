import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import json

# Lê o JSON com os dados processados
with open('dadostratados.json', encoding='utf-8') as f:
    dados = json.load(f)

# Para cada tipo de corrida (ex: uberX, 99Taxi, etc.)
for tipo_servico, corridas in dados.items():
    if isinstance(corridas, list):
        df = pd.DataFrame(corridas)
        df.rename(columns={
            'Distancia (km)': 'distancia',
            'price': 'preco',
            'DiaSemana': 'dia_semana'
        }, inplace=True)

        # Conversões de dados
        df['distancia'] = df['distancia'].str.replace('.', '', regex=False).str.replace(',', '.', regex=False).astype(float) / 1000
        df['preco'] = df['preco'].astype(float)

        # Ignorar as linhas com valores vazios ou inválidos nas colunas 'dia_semana', 'distancia' ou 'preco'
        df = df.dropna(subset=['distancia', 'preco', 'dia_semana'])  # Remove as linhas com NaN
        df = df[df['dia_semana'].astype(str).str.isnumeric()]  # Remove linhas onde 'dia_semana' não é numérico
        df['dia_semana'] = df['dia_semana'].astype(int)  # Converte para inteiro

        # Define as variáveis de entrada (X) e saída (y)
        X = df[['distancia', 'dia_semana']]
        y = df['preco']

        # Treina o modelo
        modelo = LinearRegression()
        modelo.fit(X, y)

        # Salva o modelo para cada tipo de corrida
        joblib.dump(modelo, f'modelo_{tipo_servico}.joblib')
        print(f'✅ Modelo treinado e salvo para {tipo_servico}')
