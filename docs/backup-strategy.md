# Backup Strategy

Este projeto depende de dois ativos de dados:

1. PostgreSQL (dados de conteúdo e configuração)
2. arquivos de mídia (uploads locais no diretório `media`)

## Frequência recomendada

- PostgreSQL: diário
- Media files: diário
- Backup adicional antes de grandes alterações editoriais

## 1) Backup PostgreSQL

Exemplo com `pg_dump`:

```bash
pg_dump "$DATABASE_URI" -Fc -f backups/apollo_$(date +%F).dump
```

Restauração:

```bash
pg_restore --clean --if-exists --no-owner --dbname "$DATABASE_URI" backups/apollo_YYYY-MM-DD.dump
```

## 2) Backup de mídia

Se uploads locais estiverem habilitados no Payload (`media`):

```bash
tar -czf backups/media_$(date +%F).tar.gz media
```

Restauração:

```bash
tar -xzf backups/media_YYYY-MM-DD.tar.gz
```

## Retenção sugerida

- 7 backups diários
- 4 backups semanais
- 6 backups mensais

## Armazenamento

- Guardar cópias em storage externo (S3, GCS, Azure Blob ou cofre corporativo)
- Criptografar backups em trânsito e em repouso
- Restringir acesso a equipe autorizada

## Verificação

- Realizar teste de restauração ao menos 1x por mês
- Validar integridade após restore (admin, páginas críticas, mídia)
