import os
import sqlite3


# Use Render persistent disk path when DB_PATH is provided.
DB_PATH = os.environ.get(
    "DB_PATH", os.path.join(os.path.dirname(__file__), "portfolio.db")
)


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_database() -> None:
    """
    Ensure required tables exist and visitor row is present.
    This backend stores contact messages + a simple visitor counter.
    """
    conn = _get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            count INTEGER NOT NULL DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    # Ensure there's always one row for the counter (id = 1).
    cur.execute("SELECT id FROM visitors WHERE id = 1")
    if cur.fetchone() is None:
        cur.execute(
            "INSERT INTO visitors (id, count, last_updated) VALUES (1, 0, CURRENT_TIMESTAMP)"
        )

    conn.commit()
    conn.close()


def add_contact(name: str, email: str, message: str) -> bool:
    try:
        conn = _get_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
            (name, email, message),
        )
        conn.commit()
        conn.close()
        return True
    except sqlite3.Error:
        return False


def get_visitor_count() -> int:
    conn = _get_connection()
    cur = conn.cursor()
    cur.execute("SELECT count FROM visitors WHERE id = 1")
    row = cur.fetchone()
    conn.close()
    return int(row["count"]) if row else 0


def increment_visitor_count() -> int:
    conn = _get_connection()
    cur = conn.cursor()

    cur.execute("SELECT count FROM visitors WHERE id = 1")
    row = cur.fetchone()

    if row is None:
        new_count = 1
        cur.execute(
            "INSERT INTO visitors (id, count, last_updated) VALUES (1, ?, CURRENT_TIMESTAMP)",
            (new_count,),
        )
    else:
        new_count = int(row["count"]) + 1
        cur.execute(
            "UPDATE visitors SET count = ?, last_updated = CURRENT_TIMESTAMP WHERE id = 1",
            (new_count,),
        )

    conn.commit()
    conn.close()
    return new_count


def get_all_contacts() -> list[dict]:
    conn = _get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, name, email, message, created_at
        FROM contacts
        ORDER BY created_at DESC, id DESC
        """
    )
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]

