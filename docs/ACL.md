# ACL, Permission
Permission 은 다음과 같이 구성돼있음

`node1.node2. ...:attribute1,attribute2`

## ACL Checking
기본적으로 일치하거나 더 상위의 ACL 노드가 있는지 탐색함.
예를 들어 `post.delete` 를 찾으면 `post`나 `post.delete` 가 있으면 true 를 반환함.
이 때 이를 만족하는 node들은 `req.activeAcl` 에 추가됨.

## Attribute
이 노드를 사용하는데 필요한 조건들을 attribute로 나타냄.
예를 들어 `post.delete:my,unanswered` 라면 답변이 없는 질문이고 내 질문일 경우에만 삭제가 가능.

## Active ACL
한 request 에서 사용한 ACL들
`req.acl` 함수를 호출해서 true를 반환할 때 `req.activeAcl` 에 추가됨.
