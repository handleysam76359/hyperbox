#!/bin/sh

swaks --server localhost:2525 --to 95b69506c8aef0178f089baca522e9f08f01f26137748076ea04273d83f3d019@example.com --header "Subject: $1" --attach $2
