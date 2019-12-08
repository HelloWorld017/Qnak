# Qnak
> QNA in Kaist

A SPARCS newbie project

## Warning
As this is a newbie project, the project development period was too short to implement all features,  
and purpose of this project is only "practice".  

Also, the DB structure and most things have been twisted and monkey-patched.  
(Example: User ACL, Post & PostMetadata, and more...)  

So, there might be inefficient or duplicated(because of copy-paste) codes.

## Not Implemented
* 답변 쓰기 / 보기
* 댓글 쓰기 / 보기
* 포인트가 높은 유저 보기
* 수정기능
* 삭제기능
* 반응형 레이아웃
* 유저 페이지
* 유저 메뉴
* 고급 검색 옵션
* KLMS와 연동하기
	* 과정이 세션 하이재킹을 통한 해킹과 유사하기 때문에 구현할 계획 없음
	1. kaist.ac.kr 상의 서브도메인을 얻음
	2. `https://portalsso.kaist.ac.kr/login.ps?returnURL=(해당 도메인)` iframe을 띄움
	3. PortalSSO의 Cookie인 ObSSOCookie와 evSSOCookie가 `.kaist.ac.kr` 을 대상으로 하기 때문에 해당 도메인에서 쿠키에 접근 가능
	4. 그 쿠키를 가지고 `https://ssogw6.kaist.ac.kr/appliedCourses` 에 POST 요청을 보냄
