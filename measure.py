#!/usr/bin/env python3

import json
import os
import sys
import urllib.request


def naturalsize(bytes):
    return "%3.2f kB" % (bytes / 1024)


def analyse(*, url, name):
    os.makedirs("_out", exist_ok=True)
    urllib.request.urlretrieve(url, f"_out/{name}.html")

    html = open(f"_out/{name}.html").read()

    next_data = html.split('<script id="__NEXT_DATA__" type="application/json">')[
        1
    ].split("</script>")[0]

    with open(f'_out/{name}.json', 'w') as outfile:
        outfile.write(json.dumps(json.loads(next_data), indent=2, sort_keys=True))

    print(f"html      = {naturalsize(len(html))}")
    print(f"next_data = {naturalsize(len(next_data)).rjust(9)} ({int(len(next_data) / len(html) * 100)}%)")
    print("")
    print(f"Saved HTML to _out/{name}.html")
    print(f"Saved JSON to _out/{name}.json")


if __name__ == "__main__":
    try:
        url = sys.argv[1]
        name = sys.argv[2]
    except IndexError:
        sys.exit(f"Usage: {__file__} <URL> <NAME>")

    analyse(url=url, name=name)
