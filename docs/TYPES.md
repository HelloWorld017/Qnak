# Post
## Post
Saved in: `elastic > qnak-posts`

| Name        | Description                                                  |
|-------------|--------------------------------------------------------------|
| postId      | Id of post, which is unique decimal string.                  |
| title       | Title of post                                                |
| author      | FriendlyUid of author                                        |
| excerpt     | Excerpt of post (texts in html)                              |
| date        | The unix timestamp (in milliseconds) of last modified time.  |
| college     | Alphabet letters of subject code (Ex: CS, MAS, HSS, IE, ...) |
| subject     | Subject code                                                 |
| tags        | List of tags                                                 |
| relation    | Join type of document, for post, it's name is 'question'.    |
| anonymous   | Is this value is true, the author becomes hidden             |
| attachments | Array of attachment Ids                                      |

## Comment
Saved in: `elastic > qnak-posts`

| Name      | Description                                                                     |
|-----------|---------------------------------------------------------------------------------|
| commentId | Id of comment, which is unique decimal string.                                  |
| author    | FriendlyUid of author of comment                                                |
| content   | Content of comment                                                              |
| date      | The unix timestamp (in milliseconds) of last modified time.                     |
| relation  | Join type of document, for comment, it's name is 'comment'.                     |
| targetId  | Parent postId or parent answerId                                                |

## Answer
Saved in: `elastic > qnak-posts`

| Name        | Description                                                  |
|-------------|--------------------------------------------------------------|
| postId      | Id of answer, which is unique decimal string.                |
| author      | FriendlyUid of author of answer                              |
| excerpt     | Excerpt of answer                                            |
| date        | The unix timestamp (in milliseconds) of last modified time.  |
| relation    | Join type of document, for answer, it's name is 'answer'.    |
| anonymous   | Is this value is true, the author becomes hidden             |
| attachments | Array of attachment Ids                                      |
| targetId    | Parent postId                                                |

## PostMetadata
Saved in `mongodb > qnak > posts`

| Name        | Description                                                  |
|-------------|--------------------------------------------------------------|
| postId      | Id of post, which is unique decimal string.                  |
| author      | FriendlyUid of author                                        |
| authorName  | Username of author                                           |
| title       | Title of post                                                |
| content     | HTML of content                                              |
| date        | The unix timestamp (in milliseconds) of last modified time.  |
| college     | Alphabet letters of subject code (Ex: CS, MAS, HSS, IE, ...) |
| subject     | Subject code                                                 |
| tags        | List of tags                                                 |
| anonymous   | Is this value is true, the author becomes hidden             |
| attachments | Array of attachment Ids                                      |
| upvote      | Amount of upvotes                                            |
| downvote    | Amount of downvotes                                          |
| answers     | Array of answer postIds                                      |
| comments    | Array of commentId                                           |

## AnswerMetadata
Saved in `mongodb > qnak > posts`

| Name        | Description                                                  |
|-------------|--------------------------------------------------------------|
| postId      | Id of post, which is unique decimal string.                  |
| content     | Content of answer                                            |
| date        | The unix timestamp (in milliseconds) of last modified time.  |
| anonymous   | Is this value is true, the author becomes hidden             |
| attachments | Array of attachment Ids                                      |
| author      | FriendlyUid of author                                        |
| authorName  | Username of author of answer                                 |
| upvote      | Amount of upvotes                                            |
| downvote    | Amount of downvotes                                          |
| parent      | postId of ask                                                |
| comments    | Array of commentId                                           |

# User
## User
Saved in `mongodb > qnak > users`

| Name            | Description                                                                    |
|-----------------|--------------------------------------------------------------------------------|
| userId          | Unique identification (sso uid)                                                |
| friendlyUid     | Unique identification but generated with username (`/^[a-zA-Z가-힣]+#[0-9]+$/`) |
| username        | Name of user (first_name + ' ' + last_name)                                    |
| acl             | Permissions that user have                                                     |
| profile         | Relative path of profile image (base: static/uploads), null if doesn't exist   |
| point           |                                                                                |
| minusPoint      |                                                                                |
| totalMinusPoint |                                                                                |
| plusPoint       |                                                                                |
| totalPlusPoint  |                                                                                |
| upvotedPosts    | Array of post id which the user upvoted                                        |
| downvotedPosts  | Array of post id which the user downvoted                                      |
| boards          | Array of boardId of boards user have added                                     |
| favoriteBoards  | Array of boardId of boards user have starred                                   |
| requestedBoards | Array of board id which the user requested to be created                       |
| lastUpdate      | Tokens created before this becomes invalidated                                 |

# Board
## Board
Saved in `mongodb > qnak > boards`
| Name            | Description                                                  |
|-----------------|--------------------------------------------------------------|
| boardId         | Id of the board (subject code)                               |
| title           | Name of the board (Subject name)                             |
| college         | Alphabet letters of subject code                             |
| created         | Is created or pending for create request                     |
| requestCount    | Amount of users who want this board to be created            |
