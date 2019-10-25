#!/usr/bin/env bash

# Uninstall packages
npm uninstall @dojo/framework
npm uninstall @dojo/widgets
npm uninstall @dojo/themes


# install the latest stable version
npm install @dojo/framework@latest
npm install @dojo/widgets@latest
npm install @dojo/themes@latest


# install the latest development version
npm install @dojo/framework@next
npm install @dojo/widgets@next
npm install @dojo/themes@next
