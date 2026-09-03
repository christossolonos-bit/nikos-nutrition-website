"""Serve the Lamakko preview as a local website in a desktop window."""

from __future__ import annotations

import socket
import sys
import threading
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A002
        return


def site_root() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys._MEIPASS) / "site"
    return Path(__file__).resolve().parent / "_site_preview"


def unused_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def main() -> None:
    root = site_root()
    if not (root / "index.html").is_file():
        raise SystemExit(f"Preview files not found in {root}")

    port = unused_port()
    handler = partial(QuietHandler, directory=str(root))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{port}/index.html"

    try:
        import webview

        webview.create_window(
            "Lamakko website preview",
            url,
            width=1280,
            height=860,
            min_size=(390, 640),
        )
        webview.start()
    except Exception:
        webbrowser.open(url)
        try:
            import tkinter as tk
            from tkinter import ttk

            win = tk.Tk()
            win.title("Lamakko preview")
            win.geometry("440x200")
            ttk.Label(
                win,
                text="The site is open in your browser. Click the pages like a normal website. Close this window when you are done.",
                wraplength=400,
                padding=20,
            ).pack()
            ttk.Button(win, text="Close preview", command=win.destroy).pack(pady=10)
            win.mainloop()
        except Exception:
            pass
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
