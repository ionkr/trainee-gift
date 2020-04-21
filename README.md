# trainee-gift 🎁

#### 훈련병들에게 이것저것 보낼 수 있는 프로젝트입니다.
  

#### Role
```
* 멜론  
    * 실시간 차트 TOP 100
      - /melon/MelonTop100
    * 실시간 차트 TOP 100 중 랜덤 1곡의 가사
      - /melon/RandomLyrics
    
* 다음 뉴스
    * 종합
      - /news/DaumAll 
    * 연예
      - /news/DaumEnt
    * 스포츠
      - /news/DaumSports 
    
* 코인니스
    - /news/Coinness
```
#### 

#### Usage
```
export ROLE='<ROLES>';
babel-node app.js 
```

Example  
```
export ROLE='/melon/MelonTop100, /news/DaumEnt'
babel-node app.js

// result
2020-04-21 15:18:30 [멜론차트 탑100] 새로운 데이터 가져오는 중 ...
2020-04-21 15:18:30 [다음뉴스 연예] 새로운 데이터 가져오는 중 ...
```
