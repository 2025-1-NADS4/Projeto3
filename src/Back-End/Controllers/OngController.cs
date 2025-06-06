﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServidorExemplo.Models;
using ServidorExemplo.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySqlConnector;
using System.Diagnostics;
using System;
using WebApplication2.Models;
using WebApplication3.Models;
using Microsoft.EntityFrameworkCore;


namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OngController : ControllerBase
    {
        private readonly ApiContext _context;

        public OngController(ApiContext context)
        {
            _context = context;
        }
        // Método estático para adicionar uma nova ONG ao banco de dados
        static async Task<int> AddOngToDatabase(Ong ong)
        {
            var builder = new MySqlConnectionStringBuilder
            {
                Server = "thundercat.mysql.database.azure.com",
                Database = "thundercat",
                UserID = "adminthundercat",
                Password = "thundercat2023!",
                SslMode = MySqlSslMode.Required,
            };

            using (var conn = new MySqlConnection(builder.ConnectionString))
            {
                await conn.OpenAsync();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = @"INSERT INTO ong (nome, senha_hash, cnpj, email) VALUES (@nome, @senha_hash, @cnpj, @email)";
                    command.Parameters.AddWithValue("@nome", ong.nome);
                    command.Parameters.AddWithValue("@senha_hash", ong.senha_hash);
                    command.Parameters.AddWithValue("@cnpj", ong.cnpj);
                    command.Parameters.AddWithValue("@email", ong.email);

                    int rowCount = await command.ExecuteNonQueryAsync();
                    return rowCount;
                }
            }
        }

        // Método estático para obter todas as ONGs do banco de dados
        static async Task<List<Ong>> GetAllOngsFromDatabase()
        {
            var builder = new MySqlConnectionStringBuilder
            {
                Server = "thundercat.mysql.database.azure.com",
                Database = "thundercat",
                UserID = "adminthundercat",
                Password = "thundercat2023!",
                SslMode = MySqlSslMode.Required,
            };

            var ongs = new List<Ong>();

            using (var conn = new MySqlConnection(builder.ConnectionString))
            {
                await conn.OpenAsync();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT id_ong, nome, senha_hash, cnpj, email FROM ong";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var ong = new Ong
                            {
                                id_ong = reader.GetInt32(0),
                                nome = reader.GetString(1),
                                senha_hash = reader.GetString(2),
                                cnpj = reader.GetString(3),
                                email = reader.GetString(4)
                            };
                            ongs.Add(ong);
                        }
                    }
                }
            }

            return ongs;
        }

        // Método estático para obter uma ONG pelo nome e email
        static async Task<Ong> GetOngByNomeEmail(string nome, string email)
        {
            var builder = new MySqlConnectionStringBuilder
            {
                Server = "thundercat.mysql.database.azure.com",
                Database = "thundercat",
                UserID = "adminthundercat",
                Password = "thundercat2023!",
                SslMode = MySqlSslMode.Required,
            };

            Ong ong = null;

            using (var conn = new MySqlConnection(builder.ConnectionString))
            {
                await conn.OpenAsync();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT id_ong, nome, senha_hash, cnpj, email FROM ong WHERE nome = @nome AND email = @email";
                    command.Parameters.AddWithValue("@nome", nome);
                    command.Parameters.AddWithValue("@email", email);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            ong = new Ong
                            {
                                id_ong = reader.GetInt32(0),
                                nome = reader.GetString(1),
                                senha_hash = reader.GetString(2),
                                cnpj = reader.GetString(3),
                                email = reader.GetString(4)
                            };
                        }
                    }
                }
            }

            return ong;
        }

        // Método estático para deletar uma ONG do banco de dados pelo ID
        static async Task<int> DeleteOngFromDatabase(int id_ong)
        {
            var builder = new MySqlConnectionStringBuilder
            {
                Server = "thundercat.mysql.database.azure.com",
                Database = "thundercat",
                UserID = "adminthundercat",
                Password = "thundercat2023!",
                SslMode = MySqlSslMode.Required,
            };

            using (var conn = new MySqlConnection(builder.ConnectionString))
            {
                await conn.OpenAsync();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = @"DELETE FROM ong WHERE id_ong = @id";
                    command.Parameters.AddWithValue("@id", id_ong);

                    int rowCount = await command.ExecuteNonQueryAsync();
                    return rowCount;
                }
            }
        }

        // Método HTTP POST para criar ou editar uma ONG
        [HttpPost("Ong")]
        public async Task<JsonResult> CriarEditar(Ong ong)
        {
            if (ong.id_ong == 0) // Se o id_ong for 0, cria uma nova ONG
            {
                int rowCount = await AddOngToDatabase(ong);
                if (rowCount > 0)
                {
                    return new JsonResult(Ok(new { message = "ONG adicionada com sucesso" }));
                }
                else
                {
                    return new JsonResult(StatusCode(500, new { message = "Erro ao adicionar a ONG" }));
                }
            }
            else // Caso contrário, atualiza a ONG existente
            {
                // Atualização lógica no banco de dados (para simular, pois sem _context não há contexto)
                var ongNoBD = new Ong(); // _context.ong.Find(ong.id_ong); // Simulação
                if (ongNoBD == null)
                {
                    return new JsonResult(NotFound(new { message = "ONG não encontrada" }));
                }
                ongNoBD.nome = ong.nome;
                ongNoBD.senha_hash = ong.senha_hash;
                ongNoBD.cnpj = ong.cnpj;
                ongNoBD.email = ong.email;
                // _context.SaveChanges(); // Simulação de salvamento
                return new JsonResult(Ok(new { message = "ONG atualizada com sucesso" }));
            }
        }

        // Método HTTP GET para obter uma ONG pelo ID
        [HttpGet("Ong")]
        public JsonResult Pegar(int id)
        {
            var result = new Ong(); // _context.ong.Find(id); // Simulação de busca
            if (result == null)
            {
                return new JsonResult(NotFound(new { message = "ONG não encontrada" }));
            }
            return new JsonResult(Ok(result));
        }

        // Método HTTP DELETE para deletar uma ONG pelo ID
        [HttpDelete("{id_ong}")]
        public async Task<IActionResult> Deletar(int id_ong)
        {
            int rowCount = await DeleteOngFromDatabase(id_ong);

            if (rowCount == 0)
            {
                return NotFound(new { message = "ONG não encontrada" });
            }

            return NoContent();
        }

        // Método HTTP GET para obter todas as ONGs
        [HttpGet("/GetAllOng")]
        public async Task<JsonResult> TodasOngs()
        {
            var ongs = await GetAllOngsFromDatabase();
            return new JsonResult(Ok(ongs));
        }

        // Método HTTP GET para obter uma ONG pelo nome e email
        [HttpGet("/GetByNomeEmailOng")]
        public async Task<JsonResult> PegarPorNomeEmail(string nome, string email)
        {
            var ong = await GetOngByNomeEmail(nome, email);
            if (ong == null)
            {
                return new JsonResult(NotFound(new { message = "ONG não encontrada" }));
            }
            return new JsonResult(Ok(ong));
        }
    }
}



