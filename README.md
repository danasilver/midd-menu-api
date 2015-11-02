# Middlebury Menu API

A REST API for [the Middlebury dining menu](menus.middlebury.edu).

_Updated 2015-11-02_

## Endpoints

API base url: `middmenuapi.herokuapp.com`.

### `/`
Returns the current day's menu.

### `/yyyy-mm-dd`

Returns the menu for `yyyy-mm-dd`.

## Changelog

### v2.0.0 (November 2, 2015)

- `language_tables` is not a default in `dining_halls`. It is replaced by the
entry for language tables if it exists. This may sometimes be
"Language Tables/Proctor" or something similar. The primary dining halls will
always be present as `atwater`, `ross`, and `proctor`.

- Empty entries for meals at Atwater, Ross, and Proctor are represented by
`[]` instead of `null`.

## Development

Setup:
```sh
$ npm install
```

Run the server:
```sh
$ node app.js
```
