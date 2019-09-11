# sharedir

## Description

Share your local directory content online under temporary link

## Installation

    npm install -g sharedir

## Usage

Just run

    sharedir

in the directory you want to put online

Optionally run

    sharedir {base path}

to generate a link with custom base path

## How it works

It is just a wrapper around slightly modified [serve-index](https://www.npmjs.com/package/serve-index) fork available [here](https://github.com/krzysztofciepka/serve-index) and [nat-tunnel](https://www.npmjs.com/package/nat-tunnel)

## Known issues

Make sure you have git installed since one of the dependencies is cloned straight from GitHub