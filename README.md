# nextjs-pageweight-analyser

This is a simple script I wrote for analysing page weight of a site built using [Next.js], which I what I use [at work].

When we use Next.js, we send data to the page using [getServerSideProps].
These props get rendered as JSON and stuffed inside a `<script>` tag, like so:

```html
<!DOCTYPE html>
<html lang="en" class="is-keyboard">
  <body>
    ...
    <!--
      This includes `getServerSideProps` in the `pageProps` key.
    -->
    <script id="__NEXT_DATA__" type="application/json">
    {"props":{"pageProps":{"now":"2022-09-04T00:39:10.494Z"},"__N_SSP":true},"page":"/now","query":{},"buildId":"development","runtimeConfig":{"apmConfig":{"serviceName":"content-webapp","active":true,"centralConfig":true}},"isFallback":false,"gssp":true,"customServer":true,"appGip":true,"scriptLoader":[]}
    </script>
  </body>
</html>
```

Sending unnecessary data in these props can bloat the size of the page.

This script:

*   fetches the page
*   reports the size of the HTML and the `__NEXT_DATA__` specifically
*   saves the `__NEXT_DATA__` to a pretty-printed JSON file for easy analysis

I use this script to analyse the props, to identity ways we can reduce the size of the Next.js data, and to measure the impact of changes.

[Next.js]: https://nextjs.org
[at work]: https://github.com/wellcomecollection/wellcomecollection.org
[getServerSideProps]: https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
