import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def reset_db():
    try:
        conn = psycopg2.connect(
            dbname='postgres', 
            user='postgres', 
            password='pradeepa', 
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Close all other connections to the database before dropping it
        cur.execute("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'Ecomerce'
              AND pid <> pg_backend_pid();
        """)
        
        cur.execute('DROP DATABASE IF EXISTS "Ecomerce"')
        cur.execute('CREATE DATABASE "Ecomerce"')
        print("Database 'Ecomerce' reset successfully.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_db()
