# rg -l posts | xargs perl -pi -e 's/posts/questions/g'
rg -l questions | xargs perl -pi -e 's/questions/posts/g'
