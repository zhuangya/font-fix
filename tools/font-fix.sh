#!/usr/bin/env fontforge
Open($1)
SetFontNames("", $1, $1, "", "", "")
Generate($1:r + ".ttf", "", 4)