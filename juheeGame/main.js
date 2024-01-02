var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var background_sound = new Audio('background_sound.mp3');
var jump_sound = new Audio('jump.mp3');
var end_sound = new Audio('end.mp3');

var img_background = new Image();
img_background.src = 'background.jpg';
var back = {
    x:0,
    y:0,
    width:canvas.width/1.3,
    height:canvas.height/2,

    draw(){
        ctx.drawImage(img_background, this.x, this.y, this.width, this.height);
    }
}
back.draw();

var img_user=[]
var img_user1 = new Image();
img_user1.src = 'pika1.png';
var img_user2 = new Image();
img_user2.src = 'pika2.png';
var img_user3 = new Image();
img_user3.src = 'pika3.png';
var img_user4 = new Image();
img_user4.src = 'pika4.png';

img_user=[img_user1, img_user2, img_user3, img_user4];

var user = {
    x:10,
    y:250,
    width:100,
    height:80,
    img_index:0,

    draw(a){  
        if(a%5==0){ //5프레임마다(0,1,2,3,4 이후 1씩 img_index 증가)
            this.img_index = (this.img_index+1)%4
        }
        if(user.y<250){ //user의 y값이 설정한 y값보다 작아지면 점프모양으로 고정
            ctx.drawImage(img_user[0], this.x, this.y, this.width, this.height);
        }
        else{
            ctx.drawImage(img_user[this.img_index], this.x, this.y, this.width, this.height);
        }
    }
}
user.draw(0)


var img_bomb = new Image();
img_bomb.src = 'bomb.png';

class Bomb{ //장애물
    constructor(){
        this.x = 500;
        this.y = 250;
        this.width = 50;
        this.height = 50;
    }
    draw(){
       // ctx.fillStyle = 'red';
       // ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(img_bomb, this.x, this.y, this.width, this.height);
    }
}

//var bomb = new Bomb();
//bomb.draw()


var timer = 0; //프레임 측정
var bombs = []; //장애물 리스트
var jumpingTimer = 0; //60프레임 세주는 변수
var animation;

function frameSecond(){ 
    //1초마다 60번 코드 실행
    animation = requestAnimationFrame(frameSecond);
    timer++;

    //프레임 돌때마다 프레임에 있는 요소들 clear해주는 함수
    ctx.clearRect(0,0,canvas.width, canvas.height);
    

    //배경 추가
    back.draw();

    //점수 추가
    gameScore();

    //배경음악 재생
    background_sound.play();

    if(timer % 300 == 0){ //2초마다
        var bomb = new Bomb();
        bombs.push(bomb);
    }

    bombs.forEach((b, i, o)=>{
        if(b.x < 0){
            //i가 가리키는 값에서부터 1개 삭제
            o.splice(i,1);
            
        }

        b.x--;

        //bomb 점수 추가
        bomb_gameScore(b.x);

        collision(user, b);

        b.draw();
    })


    //user.x++;
    //점프
    if (jumping == true){   
        user.y = user.y-2;
        jumpingTimer++;    
    }
    //점프 1초후
    if(jumpingTimer > 60){  
        jumping = false;
        jumpingTimer= 0;
    }
    //jumping이 false이고 user.y가 250 미만이면 하강
    if(jumping == false && user.y < 250){ 
        user.y = user.y+2;
    }

    user.draw(timer);
}

frameSecond();


//충돌 확인 코드
function collision(user, bomb){
    var x_diff = bomb.x - (user.x+user.width);
    var y_diff = bomb.y - (user.y+user.height);
    if(x_diff <0 && y_diff<0){
        cancelAnimationFrame(animation);
        gameOver();
        background_sound.pause();
        end_sound.play();
    }
}


var jumping = false;
document.addEventListener('keydown', function(e){
    if(e.code === 'Space'){
        jumping = true;
        //점프 효과음 재생
        jump_sound.play();
    }
})

function gameOver(){
    ctx.font = '60px 맑은 고딕';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', canvas.width/5, canvas.height/5);

}


function gameScore(){
    ctx.font = '20px 맑은 고딕';
    ctx.fillStyle = 'black';
    ctx.fillText('SCORE : '+ Math.round(timer/100), 10,30);  
}


var score = 0;
function bomb_gameScore(x){
    ctx.font = '20px 맑은 고딕';
    ctx.fillStyle = 'black';
    
    if(x==0){
        score ++;
    }
    ctx.fillText('SCORE : '+ score, 10,60);
}
