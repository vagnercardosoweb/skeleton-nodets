#!/usr/bin/env bash

rm -rf dist
mkdir -p dist/src

cp -r database tmp views dist/
cp package.json yarn.lock ecosystem.config.js dist/
cp .env.example .sequelizerc dist/
