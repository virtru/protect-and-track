#!/usr/bin/env python3

import re

from sys import stdin

# State variable to track when we are erasing out-of-date snippets
scrubbing = 0

state = 0
for line in stdin:
  if state == 0:
    is_comment = re.match(r'^//', line)
    if is_comment is None:
      state = 1
  if state == 1:
    if not line.isspace() and line != '' and line is not None:
      state = 2
  if state == 2:
    print(line, end='')
