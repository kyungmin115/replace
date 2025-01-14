# FullStack_Team_Project_RE:PLACE
SpringBoot, React, Python, AWS를 이용한 공연 예약 예매와 굿즈 판매 사이트


## 프로젝트 소개
공연 예약,예매와 굿즈 판매가 병합된 사이트를 구현한 프로젝트입니다.


## 프로젝트 명 

# RE:PLACE

## 개발 기간

- 24.11.25(월) ~ 25.01.10(금)

### 맴버

<table>
  <tr>
    <td align="center"><a href="https://github.com/autumn-trip"><img src="https://avatars.githubusercontent.com/autumn-trip" width="100px;" alt=""/><br /><sub><b>autumn-trip</b></sub></a></td>
    <td align="center"><a href="https://github.com/rlawltn3551"><img src="https://avatars.githubusercontent.com/rlawltn3551" width="100px;" alt=""/><br /><sub><b>rlawltn3551</b></sub></a></td>
    <td align="center"><a href="https://github.com/kyungmin115"><img src="https://avatars.githubusercontent.com/kyungmin115" width="100px;" alt=""/><br /><sub><b>kyungmin115</b></sub></a></td>
     <td align="center"><a href="https://github.com/Yeop9999"><img src="https://avatars.githubusercontent.com/Yeop9999" width="100px;" alt=""/><br /><sub><b>Yeop9999</b></sub></a></td>
  </tr>
</table>

- 팀장 : 이중모
  
- 팀원 : 김지수, 이경민, 김창엽

 ------------------------------------------------------------------------------------
- ## 목차

#### 📊 I. 개발 환경

#### 🛠 II. 주요 기능 & 설명

#### 📑 III. 배포

#### 💻 IV.시연 영상


--------------------------------------------------------------------------------------

### 📊I.개발환경

- 언어


  <img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> 

  
- 개발 도구

  <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/springsecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"><br/>
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"> <img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white"><br/>
<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/tensorflow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"><br/>
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=sass&logoColor=white"> <img src="https://img.shields.io/badge/JSS-F7DF1E?style=for-the-badge&logo=JSS&logoColor=white"><br/> <img src="https://img.shields.io/badge/mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=white">


- IDE 

   <img src="https://img.shields.io/badge/intellij-000000?style=for-the-badge&logo=intellijidea&logoColor=white">
   
- 운영 체제
  
   <img src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white">





- Java SDK : Oracle JDK 17
- 배포 :<img src="https://img.shields.io/badge/aws-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white">

- ---
## ERD
![image](https://github.com/user-attachments/assets/92f8894c-d50e-4d90-909e-4e3e157ad0ef)


---
## 프로젝트 구조
![image](https://github.com/user-attachments/assets/6f139c1b-74e4-4484-8ed2-3228bf159743)

---

##  🛠II.주요 기능
![Animation](https://github.com/user-attachments/assets/8623b2b5-b333-4fb5-aec1-e0a7aa84d105)

### 반응형
![Animation](https://github.com/user-attachments/assets/9e6ae236-6d46-40bd-afcf-65239dd9ca11)

- PC
  ![image](https://github.com/user-attachments/assets/0e50e1a1-6464-4c4e-a658-be2188acff67)
  
- 모바일
  
 ![image](https://github.com/user-attachments/assets/c94c2193-5f89-4a1b-aa62-3389df99f4ac)
 -------------------------------------------------------------------------------------

### 로그인 처리
![Animation1](https://github.com/user-attachments/assets/b6c6b7ee-305f-4481-9c40-b7f811de229e)

#### action과 reducer 처리를 위한 slice 생성
![image](https://github.com/user-attachments/assets/fd97172b-766c-4dd3-abfe-30b6ac8c39ee)

#### 쿠키를 통한 로그인 정보 로딩
![image](https://github.com/user-attachments/assets/d69525c7-c16e-4e83-b43b-41ddd8d06bdf)


 -------------------------------------------------------------------------------------
### 장바구니
![Animation2](https://github.com/user-attachments/assets/9f538332-6270-4554-a8ac-c7ef3f54c207)

#### 전역에서 장바구니 상태를 관리할 store 생성
#### extraReducers(비동기)와 createAsyncThunk를 활용한 로직 설정
#### 장바구니 아이템 상태 변경
![image](https://github.com/user-attachments/assets/69c4bc82-63c3-43ac-bcc8-6474321698d5)
![image](https://github.com/user-attachments/assets/7ef0ba30-20b8-4b97-b26a-2d68562c2d64)
![image](https://github.com/user-attachments/assets/4b093661-d2e9-4cb1-b7d8-3926e6896721)

 -------------------------------------------------------------------------------------
### 이미지 검색
![Animation3](https://github.com/user-attachments/assets/41556839-d1f7-48c6-a85a-9ed89759d290)

#### DB에 있는 굿즈 이미지와 굿즈 이름만을 가지고 데이터 셋 제작 및 이미지 전처리, 레이블 숫자로 변환 후 oneHot Encoding
#### MobileNetV2 모델을 기반으로 새롭게 데이터를 주입하여 파인 튜닝 후 모델 학습
#### 학습한 모델을 리액트에서 로드하기 위해 JS 형식으로 변환하여 저장
![image](https://github.com/user-attachments/assets/edaa4699-5fcb-4c44-a060-73a5bf8c4069)
![image](https://github.com/user-attachments/assets/e156da96-8fa9-4d25-a9d6-f38bccc6e388)
![image](https://github.com/user-attachments/assets/12361f78-60a0-4703-8928-8b6c1918028d)
![image](https://github.com/user-attachments/assets/f5ebef84-8f02-4058-be1d-0f82f927862d)

 -------------------------------------------------------------------------------------
### 고객센터
![Animation4](https://github.com/user-attachments/assets/d9090d31-3c18-463a-b787-2ab2c8d6a12c)

#### loginState 메서드를 사용하여 관리자(ROLE: ADMIN)만 확인 및 댓글 작성할 수 있도록 구성
![image](https://github.com/user-attachments/assets/95a43c6f-bf65-49bf-b07f-8b7bee16c408)

#### 게시글 조회, 등록, 수정, 삭제 등 구현
![image](https://github.com/user-attachments/assets/ec6680d1-1fc5-48d5-bf57-7ec8c061fc3e)

 -------------------------------------------------------------------------------------
## 📑 III. 배포

#### 1. IAM을 통한 권한과 역할 생성<br>
#### 2. EC2 가상 서버로 애플리케이션 실행<br>
#### 3. RDS를 활용한 데이터베이스 설정 수정<br>
#### 4. Elastic Beanstalk를 이용한 배포 자동화 
![image](https://github.com/user-attachments/assets/17fbf62c-c4fa-4aaf-a25d-273bd73bba03)
 -------------------------------------------------------------------------------------
## 💻 IV.시연 영상
https://www.youtube.com/watch?v=zPMYh7Ai_gs
