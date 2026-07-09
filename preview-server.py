from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    host = "127.0.0.1"
    port = 8010
    public_dir = Path(__file__).resolve().parent / "public"
    handler = partial(NoCacheHandler, directory=str(public_dir))
    server = ThreadingHTTPServer((host, port), handler)
    print(f"Serving Crossleys preview at http://{host}:{port}/")
    server.serve_forever()
