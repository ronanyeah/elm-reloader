# elm-reloader

Hot code swapping support for Elm 0.19. This automatically reloads your code in the browser after a change, while preserving your current app state.

This package provides a Webpack loader that can be used in conjunction with [elm-webpack-loader](https://github.com/elm-community/elm-webpack-loader). If you're looking for something that doesn't require Webpack, see [elm-hot](https://github.com/klazuka/elm-hot).

## Installation

```bash
$ npm install --save-dev elm-reloader
```

You will also need to install [elm-webpack-loader](https://github.com/elm-community/elm-webpack-loader), if you haven't already.


## Usage

Assuming that you're already using `elm-webpack-loader`, just add `{ loader: 'elm-reloader' }` immediately 
**before** `elm-webpack-loader` in the `use` array. 

It should look something like this:

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.elm$/,
                exclude: [/elm-stuff/, /node_modules/],

                use: [
                    { loader: 'elm-reloader' },
                    {
                        loader: 'elm-webpack-loader',
                        options: {
                            cwd: __dirname
                        }
                    }
                ]
            }
        ]
    }
}
```

## Example

Check out the [example app](https://github.com/ronanyeah/elm-webpack).