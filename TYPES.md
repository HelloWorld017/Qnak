# Post
## Post
Saved in: `elastic > qnak-posts`

| Name     | Description                                                  |
|----------|--------------------------------------------------------------|
| postId   | Id of post, which is unique hexadecimal string.              |
| title    | Title of post                                                |
| author   | Username of author                                           |
| content  | Content of post                                              |
| date     | The unix timestamp (in milliseconds) of last modified time.  |
| college  | Alphabet letters of subject code (Ex: CS, MAS, HSS, IE, ...) |
| subject  | Subject code                                                 |
| relation | Join type of document, for post, it's name is 'question'.    |

## Comment
Saved in: `elastic > qnak-posts`

| Name      | Description                                                 |
|-----------|-------------------------------------------------------------|
| commentId | Id of comment, which is unique hexadecimal string.          |
| author    | Username of author of comment                               |
| content   | Content of comment                                          |
| date      | The unix timestamp (in milliseconds) of last modified time. |
| relation  | Join type of document, for comment, it's name is 'comment'. |

## Answer
Saved in: `elastic > qnak-posts`

| Name     | Description                                                  |
|----------|--------------------------------------------------------------|
| answerId | Id of answer, which is unique hexadecimal string.            |
| author   | Username of author of answer                                 |
| content  | Content of answer                                            |
| date     | The unix timestamp (in milliseconds) of last modified time.  |
| relation | Join type of document, for answer, it's name is 'answer'.    |

## PostMetadata
Saved in `mongodb > qnak > posts`

## AnswerMetadata
Saved in `mongodb > qnak > answers`
