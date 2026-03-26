from flask import Flask, jsonify, send_from_directory, render_template_string, request
from flask_cors import CORS

from database import (
    add_contact,
    get_all_contacts,
    increment_visitor_count,
    init_database,
)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


app = Flask(__name__, static_folder=".")
CORS(app)

# Initialize database on startup
init_database()


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/admin")
def admin():
    """Admin page to view all contact messages."""
    contacts = get_all_contacts()

    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Admin - Contact Messages</title>
        <style>
            body {
                font-family: 'Courier New', monospace;
                background: #05060f;
                color: #00ffcc;
                padding: 20px;
            }
            h1 {
                text-align: center;
                color: #00ffff;
                text-shadow: 0 0 10px #00ffff;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                background: #0f1224;
                border: 1px solid #00ff41;
            }
            th, td {
                padding: 12px;
                text-align: left;
                border: 1px solid rgba(0, 255, 65, 0.55);
                word-break: break-word;
            }
            th {
                background: #0b0f22;
                color: #00ffff;
                font-weight: bold;
            }
            tr:hover { background: #13204a; }
            .count {
                text-align: center;
                margin-top: 20px;
                font-size: 18px;
                color: #6efcff;
            }
        </style>
    </head>
    <body>
        <h1>📬 CONTACT MESSAGES</h1>
        <div class="count">Total Messages: {{ contacts|length }}</div>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
            </tr>
            {% for contact in contacts %}
            <tr>
                <td>{{ contact.id }}</td>
                <td>{{ contact.name }}</td>
                <td>{{ contact.email }}</td>
                <td>{{ contact.message }}</td>
                <td>{{ contact.created_at }}</td>
            </tr>
            {% endfor %}
        </table>
    </body>
    </html>
    """
    return render_template_string(html, contacts=contacts)


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(BASE_DIR, path)


# API Routes
@app.route("/api/contact", methods=["POST"])
def contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json(silent=True) or {}

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        message = str(data.get("message", "")).strip()

        if not name or not email or not message:
            return jsonify({"error": "All fields are required", "success": False}), 400

        if "@" not in email or "." not in email:
            return jsonify({"error": "Invalid email address", "success": False}), 400

        success = add_contact(name, email, message)

        if success:
            return (
                jsonify(
                    {
                        "message": "Message sent successfully! I will get back to you soon.",
                        "success": True,
                    }
                ),
                200,
            )

        return jsonify({"error": "Failed to save message. Please try again.", "success": False}), 500
    except Exception:
        return jsonify({"error": "Internal server error", "success": False}), 500


@app.route("/api/stats", methods=["GET"])
def stats():
    """Return visitor statistics."""
    try:
        visitor_count = increment_visitor_count()
        return jsonify({"visitors": visitor_count, "success": True}), 200
    except Exception:
        return jsonify({"error": "Internal server error", "success": False}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "message": "Server is running"}), 200


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Starting Portfolio Server")
    print("=" * 60)
    print("📍 Local:   http://localhost:5000")
    print("📍 Network: http://127.0.0.1:5000")
    print("📍 Admin:   http://localhost:5000/admin")
    print("=" * 60 + "\n")
    import os as _os

    port = int(_os.environ.get("PORT", "5000"))
    app.run(debug=True, host="0.0.0.0", port=port)

