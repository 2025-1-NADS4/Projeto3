import joblib
import numpy as np
import pandas as pd
import json

# Lê o JSON com os dados processados
with open('dadostratados.json', encoding='utf-8') as f:
    dados = json.load(f)

# Dados de entrada (distância e dia da semana)
entrada = pd.DataFrame([[2.5, 2]], columns=['distancia', 'dia_semana'])  # Usando um DataFrame

# Dicionário para armazenar as previsões de todos os tipos de serviço
previsoes = {}

# Obtém automaticamente os tipos de serviço a partir das chaves do dicionário
tipos_servico = dados.keys()

# Para cada tipo de corrida, carrega o modelo correspondente e faz a previsão
for tipo in tipos_servico:
    try:
        modelo = joblib.load(f'modelo_{tipo}.joblib')  # Carrega o modelo para o tipo específico
        previsao = modelo.predict(entrada)  # Faz a previsão
        previsoes[tipo] = previsao[0]  # Armazena a previsão no dicionário
        print(f'💰 Preço previsto para {tipo}: R$ {previsao[0]:.2f}')  # Exibe o preço previsto
    except FileNotFoundError:
        print(f'❌ Modelo para {tipo} não encontrado.')

# Exibe a previsão mais vantajosa
if previsoes:
    tipo_mais_vantajoso = min(previsoes, key=previsoes.get)  # Encontra o tipo com o menor preço
    print(f'\nO tipo de corrida mais vantajoso é: {tipo_mais_vantajoso} com preço de R$ {previsoes[tipo_mais_vantajoso]:.2f}')
else:
    print('❌ Nenhuma previsão foi realizada.')
