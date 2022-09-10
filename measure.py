#!/usr/bin/env python3

import json
import os
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

    print(url, name)
    print(f"html      = {naturalsize(len(html))}")
    print(f"next_data = {naturalsize(len(next_data)).rjust(9)} ({int(len(next_data) / len(html) * 100)}%)")
    print("")


if __name__ == "__main__":
    for url, name in [
        ("https://wellcomecollection.org/", "homepage"),
        ("https://wellcomecollection.org/stories", "stories"),
        ("https://wellcomecollection.org/articles/Yp3GthEAACIAwRi9", "article"),
        # ("http://localhost:3000/whats-on", "whats-on"),
        # ("http://localhost:3000/works", "works"),
        # ("http://localhost:3000/images", "images"),
        # ("http://localhost:3000/works/a222wwjt", "a222wwjt"),
        # ("http://localhost:3000/works?query=fish", "search-fish"),
    ]:
        analyse(url=url, name=name)
