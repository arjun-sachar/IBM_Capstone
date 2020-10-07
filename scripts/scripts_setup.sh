#!/usr/bin/env bash

# Installs required perl libraries needed to run deploy script

echo "You will be prompted for your password. That's ok, just type in the password you use to log in to your computer with."
echo ""
echo ""
echo "-------"

curl -L https://cpanmin.us | perl - --sudo App::cpanminus

cpanm -n Modern::Perl --sudo
cpanm -n Template::Toolkit --sudo
cpanm -n Modern::Perl --sudo
