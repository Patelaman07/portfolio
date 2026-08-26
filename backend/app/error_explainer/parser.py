import re

# g++ diagnostic line: "<file>:<line>:<col>: error|warning|note: <message>"
DIAG_RE = re.compile(r"^(?P<file>.+?):(?P<line>\d+):(?P<col>\d+):\s+(?P<type>error|warning|note):\s+(?P<message>.*)$")


def parse_gcc_output(text: str) -> list[dict]:
    """Turns raw g++ stderr into structured {type, line, column, message, detail} entries.
    'note:' lines get folded into the preceding error/warning's detail rather than
    becoming their own entries — they're context, not separate problems."""
    entries: list[dict] = []
    current: dict | None = None

    for line in text.splitlines():
        m = DIAG_RE.match(line)
        if m:
            d = m.groupdict()
            if d["type"] == "note" and current is not None:
                current["detail"] += ("\n" if current["detail"] else "") + line
                continue
            current = {
                "type": d["type"],
                "line": int(d["line"]),
                "column": int(d["col"]),
                "message": d["message"],
                "detail": "",
            }
            entries.append(current)
        elif current is not None:
            current["detail"] += ("\n" if current["detail"] else "") + line

    return entries
