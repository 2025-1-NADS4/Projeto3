import dash
from dash import dcc, html, Input, Output
import pandas as pd
import plotly.express as px
from IPython.core.display import display, HTML
display(HTML("<style>.output_wrapper, .output {height:auto !important; max-height:1000px;}</style>"))


# Dados
df = pd.read_excel("Base Dados.xlsx")

# Mapeamento dos dias da semana
dias_semana_map = {
    1: 'Segunda-feira',
    2: 'Terça-feira',
    3: 'Quarta-feira',
    4: 'Quinta-feira',
    5: 'Sexta-feira',
    6: 'Sábado',
    7: 'Domingo'
}

# App Dash
app = dash.Dash(__name__)

# Layout
# ... (imports e carregamento dos dados permanecem iguais)

# Layout
app.layout = html.Div([
    html.Div([
        html.Div([
            html.Label("Filtrar por tipo de veículo:"),
            dcc.Dropdown(
                id='dropdown-veiculo',
                options=[{'label': v, 'value': v} for v in df['Veiculo'].unique()],
                value='uberX',
                style={'width': '100%'}
            )
        ], style={'width': '48%', 'paddingRight': '1%'}),

        html.Div([
            html.Label("Filtrar por dia da semana:"),
            dcc.Dropdown(
                id='dropdown-dia',
                options=[{'label': nome, 'value': dia} for dia, nome in dias_semana_map.items()],
                value=1,
                style={'width': '100%'}
            )
        ], style={'width': '48%', 'paddingLeft': '1%'})
    ], style={'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '30px'}),
    
    html.H1("Dashboard de Corridas", style={'textAlign': 'center'}),

    # Linha 1
    html.Div([
        html.Div([dcc.Graph(id='scatter-grafico')], style={'width': '48%', 'paddingRight': '1%'}),
        html.Div([dcc.Graph(id='bar-grafico')], style={'width': '48%', 'paddingLeft': '1%'})
    ], style={'display': 'flex', 'justifyContent': 'space-between'}),

    # Linha 2
    html.Div([
        html.Div([dcc.Graph(id='pie-grafico')], style={'width': '48%', 'paddingRight': '1%', 'marginTop': '30px'}),
        html.Div([dcc.Graph(id='line-grafico')], style={'width': '48%', 'paddingLeft': '1%', 'marginTop': '30px'})
    ], style={'display': 'flex', 'justifyContent': 'space-between'}),

    # Linha 3
    html.Div([
        html.Div([dcc.Graph(id='box-grafico')], style={'width': '48%', 'paddingRight': '1%', 'marginTop': '30px'}),
        html.Div([dcc.Graph(id='hist-grafico')], style={'width': '48%', 'paddingLeft': '1%', 'marginTop': '30px'})
    ], style={'display': 'flex', 'justifyContent': 'space-between'}),

    # Linha 4
    html.Div([
        html.Div([dcc.Graph(id='area-grafico')], style={'width': '48%', 'margin': '30px auto'})
    ], style={'display': 'flex', 'justifyContent': 'center'})
])


# Callback
@app.callback(
    [Output('scatter-grafico', 'figure'),
     Output('bar-grafico', 'figure'),
     Output('pie-grafico', 'figure'),
     Output('line-grafico', 'figure'),
     Output('box-grafico', 'figure'),
     Output('hist-grafico', 'figure'),
     Output('area-grafico', 'figure')],
    [Input('dropdown-veiculo', 'value'),
     Input('dropdown-dia', 'value')]
)
def update_graphs(selected_vehicle, selected_day):
    df_filtered = df[(df['Veiculo'] == selected_vehicle) & (df['DiaSemana'] == selected_day)]

    # Gráfico de Dispersão
    scatter = px.scatter(
        df_filtered,
        x='Distancia (km)',
        y='Price',
        title=f"Distância vs Preço ({selected_vehicle} - {dias_semana_map[selected_day]})",
        labels={'Distancia (km)': 'Distância (km)', 'Price': 'Preço (R$)'}
    )

    # Gráfico de Barras
    bar_data = df[df['DiaSemana'] == selected_day].groupby('Veiculo')['Price'].mean().reset_index()
    bar = px.bar(bar_data, x='Veiculo', y='Price',
                 title=f"Média de Preço por Veículo ({dias_semana_map[selected_day]})",
                 labels={'Price': 'Preço Médio (R$)'})

    # Gráfico de Boxplot
    box_data = df[df['DiaSemana'] == selected_day]
    box = px.box(box_data, x='Veiculo', y='Price',
                 title=f"Distribuição de Preços por Veículo ({dias_semana_map[selected_day]})",
                 labels={'Price': 'Preço (R$)'})

    # Gráfico de Histograma
    hist = px.histogram(df_filtered, x='Price', nbins=20,
                        title=f"Frequência de Corridas por Faixa de Preço ({selected_vehicle} - {dias_semana_map[selected_day]})",
                        labels={'Price': 'Preço (R$)'})

    # Gráfico de Área
    df_filtered_sorted = df_filtered.sort_values(by='Price')
    df_filtered_sorted['Preço Acumulado'] = df_filtered_sorted['Price'].cumsum()
    area = px.area(df_filtered_sorted, x=df_filtered_sorted.index, y='Preço Acumulado',
                   title=f"Evolução Acumulada de Preço ({selected_vehicle} - {dias_semana_map[selected_day]})",
                   labels={'index': 'Corrida', 'Preço Acumulado': 'Preço Acumulado (R$)'})

    # Gráfico de Pizza
    pie_data = df[df['DiaSemana'] == selected_day]
    pie = px.pie(pie_data, names='Veiculo',
                 title=f"Distribuição das Corridas ({dias_semana_map[selected_day]})")

    # Gráfico de Linha
    line = px.line(df_filtered.reset_index(), x=df_filtered.reset_index().index, y='Price',
                   title=f"Preço ao longo do tempo ({selected_vehicle} - {dias_semana_map[selected_day]})",
                   labels={'index': 'Corrida', 'Price': 'Preço (R$)'})

    return scatter, bar, pie, line, box, hist, area

# Execução
if __name__ == '__main__':
    app.run(debug=True)







