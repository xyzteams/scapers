
# The Scapers

welcome to our team project, we will share a javascript library that is needed by those making features, this library is widely used by our websites and friends, hopefully it will make things easier for you

## Installation

Install My Project with npm

```bash
  npm install @xyzteams/scapers
```
    
## Running Tests

To run tests, run the following command

```bash
import XYZ from "@xyzteams/scapers";
// import XYZ from "./dist/index.min.mjs"

(async () => {
    const url = "https://www.tiktok.com/@xyzenprst/video/7335354879206001927"
    const res = await XYZ.download.tiktok(url)
    console.log(res)
})()
```


## Optimizations

to make it better and faster, please delete the modules that don't use this library, you already use the axios, cheerio and form-data modules, if you have any, please just delete them.


## Authors

- [Muhammad Adriansyah](https://www.github.com/xyzencode)
- [Mr One](https://www.github.com/onepunya)
- [Kaviaan](https://github.com/kaviaann)

## FAQ

#### How to install it?

It's easy, just npm install @xyzteams/scapers


#### What support bro?

supports everything like CJS and ESM as well as Typescript


## Contributing

contribute with my friends, all of them are at `contributing.md`


## Feedback

If you have any feedback, please reach out to us at xyz.teams@xyzen.tech
