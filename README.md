# 만들어야 할 것
* 포스트 목록 보기
* 답변 쓰기 / 보기
* 댓글 쓰기 / 보기
* 태그기능
* 포인트가 높은 유저 보기
* 수정기능
* 삭제기능
* 반응형 레이아웃
* 유저 페이지
* 유저 메뉴
* 검색 페이지
* 고급 검색 옵션
* KLMS와 연동하기
	1. kaist.ac.kr 상의 서브도메인을 얻음
	2. `https://portalsso.kaist.ac.kr/login.ps?returnURL=(해당 도메인)` iframe을 띄움
	3. PortalSSO의 Cookie인 ObSSOCookie와 evSSOCookie가 `.kaist.ac.kr` 을 대상으로 하기 때문에 해당 도메인에서 쿠키에 접근 가능
	4. 그 쿠키를 가지고 `https://ssogw6.kaist.ac.kr/appliedCourses` 에 POST 요청을 보냄
