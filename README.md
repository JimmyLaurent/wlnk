# Wnlk

Link resolver for captcha protected links from "wlnk.ec".

## Captcha example

![Captcha example](./captcha-example.png)

## Install
```bash
$ git clone https://github.com/JimmyLaurent/wnlk
$ cd wnlk
$ npm link
```

## CLI Usage

```bash
██╗    ██╗███╗   ██╗██╗     ██╗  ██╗
██║    ██║████╗  ██║██║     ██║ ██╔╝
██║ █╗ ██║██╔██╗ ██║██║     █████╔╝
██║███╗██║██║╚██╗██║██║     ██╔═██╗
╚███╔███╔╝██║ ╚████║███████╗██║  ██╗
 ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝

Usage: wlnk <linkUrl>

Options:
  -V, --version  output the version number
  -d, --dump     Dump captcha letters
  -h, --help     output usage information
```

## Library usage

### getLink

```js
const { getLink } = require('wnlk');

(async () => {
  // Resolve a captcha protected link
  const resolvedLink = await getLink('{YOUR_LINK_URL}');
  console.log(resolvedLink);
})();
```

## Note

It was a fun challenge to resolve captcha from scratch with a simple png library.

## Reference

https://codepen.io/birjolaxew/post/cracking-captchas-with-neural-networks