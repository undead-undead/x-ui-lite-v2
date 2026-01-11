use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::env;

pub async fn init_pool() -> anyhow::Result<SqlitePool> {
    let database_url =
        env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:/usr/local/x-ui/data/x-ui.db".to_string());

    tracing::info!("Connecting to database: {}", database_url);

    let _ = std::fs::create_dir_all("/usr/local/x-ui/data");

    let pool = SqlitePoolOptions::new()
        .max_connections(2)
        .after_connect(|conn, _| {
            Box::pin(async move {
                sqlx::query("PRAGMA cache_size = 512;")
                    .execute(&mut *conn)
                    .await?;
                sqlx::query("PRAGMA journal_mode = WAL;")
                    .execute(&mut *conn)
                    .await?;
                sqlx::query("PRAGMA synchronous = NORMAL;")
                    .execute(&mut *conn)
                    .await?;
                Ok(())
            })
        })
        .connect(&database_url)
        .await?;

    tracing::info!("Database connected successfully");

    Ok(pool)
}

pub async fn run_migrations(pool: &SqlitePool) -> anyhow::Result<()> {
    tracing::info!("Running database migrations...");

    let init_sql = include_str!("../../migrations/001_init.sql");
    for statement in init_sql.split(';') {
        let s = statement.trim();
        if !s.is_empty() {
            let _ = sqlx::query(s).execute(pool).await;
        }
    }

    let columns = ["tag", "listen", "allocate"];
    for col in columns {
        let check_sql = format!("ALTER TABLE inbounds ADD COLUMN {} TEXT", col);
        match sqlx::query(&check_sql).execute(pool).await {
            Ok(_) => tracing::info!("Successfully added column: {}", col),
            Err(e) => {
                let err_msg = e.to_string();
                if err_msg.contains("duplicate column name") || err_msg.contains("already exists") {
                    tracing::debug!("Column {} already exists, skipping", col);
                } else {
                    tracing::warn!("Failed to add column {}: {}", col, err_msg);
                }
            }
        }
    }

    let _ = sqlx::query("ALTER TABLE users ADD COLUMN password_version INTEGER NOT NULL DEFAULT 1")
        .execute(pool)
        .await;

    tracing::info!("Migrations completed successfully");

    Ok(())
}
