

# IncidentSystem












## SAST - Semgrep

```text

docker run --rm -v "$(pwd):/src" returntocorp/semgrep semgrep --config auto
┌─────────────┐
│ Scan Status │
└─────────────┘
Scanning 88 files tracked by git with 1074 Code rules:

Language      Rules   Files          Origin      Rules
─────────────────────────────        ───────────────────
<multilang>      60      88          Community    1074
csharp           33      35
json              4      14
ts              163      12
yaml             35       4
dockerfile        6       4
js              153       1
html              1       1


┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
• Findings: 3 (3 blocking)
• Rules run: 298
• Targets scanned: 88
• Parsed lines: ~99.9%
• Scan was limited to files tracked by git
• For a detailed list of skipped files and lines, run semgrep with the --verbose flag
Ran 298 rules on 88 files: 3 findings.
```
