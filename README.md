# Qnak
> QNA in Kaist

A SPARCS newbie project

## Warning
As this is a newbie project, the project development period was too short to implement all features,  
and purpose of this project is only "practice".  

Also, the DB structure and most things have been twisted and monkey-patched.  
(Example: User ACL, Post & PostMetadata, and more...)  

So, there might be inefficient or duplicated(because of copy-paste) codes.

## Stack
### Backend
* ElasticSearch
* MongoDB
* Redis
* node.js / Express

### Frontend
* VueJS
  * TipTap Editor
* LessCSS

## Not Implemented
* Point Ranking
* Editing Post/Comments
* Deleting Post/Comments
* Responsive Layout
* User Page/Menu
* Advanced Search
* Integrating with Academic System
  * WILL NOT be implemented as its process is similar with session hijacking
  1. Getting subdomain of `kaist.ac.kr`
  2. Showing iframe of `https://portalsso.kaist.ac.kr/login.ps?returnURL=(The Domain)`
  3. As the target domain of cookies `ObSSOCookie` and `evSSOCookie` is `.kaist.ac.kr`, we can access the cookie
  4. Send POST request to the `https://ssogw6.kaist.ac.kr/appliedCourses` using the obtained cookie

## Screenshot
![Post Screenshot](https://i.imgur.com/AmDtHAG.png)
![Listing Screenshot](https://i.imgur.com/fHtPxxG.png)
