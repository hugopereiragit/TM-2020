
var highScore = localStorage.getItem('highscore');if(highScore  === null) { //Para guardar o highscore no browser
    // Se não existir highscore mete o valor como 0
    localStorage.setItem('highscore', 0);
    highScore = 0;
}


var text;
var counter = 0;
function listener () {

    game.state.start('main'); // comeca o jogo
}

function listener2 () {

    game.state.start('menu'); // volta ao menu
}

var menuState = {

    preload: function() {
        // executado no inicio

        // faz load aos presets

        game.load.image('BACKGROUND','assets/background.png');
        game.load.image('play', 'assets/play.png');
        game.load.image('logo', 'assets/logo.png');


    },

    create: function() {
      //  game.stage.backgroundColor = '#71c5cf'

        var BACKGROUND = game.add.tileSprite(0, 0, 500, 500, "BACKGROUND")
        this.play = game.add.sprite(50, 60 , 'logo');

        this.play = game.add.sprite(25, 295, 'play');
        this.play.inputEnabled = true;  // ativa todo o input do botao play (clicks)
        this.play.events.onInputDown.add(listener, this); // chama o listener quando e carrgeado o botao

        this.labelScore = game.add.text(65, 240,'HIGHSCORE : ' + localStorage.getItem("highscore"),  //Local storage guarda o highscore no browser
            { font: "30px Arial", fill: "#ffffff" });




    },

    listener: function() {

        game.state.start('main');
}

}

var mainState = {
    preload: function() {
        // executado no inicio

        // faz load aos presets
        game.load.image('bird', 'assets/bird.png');
        game.load.image('bird2', 'assets/bird2.png');
        game.load.image('bird3', 'assets/bird3.png');
        game.load.image('bird4', 'assets/bird4.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('BACKGROUND','assets/background.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('ding', 'assets/ding.mp3');
        game.load.audio('death', 'assets/death.mp3');

    },

    create: function() {
        // Muda a cor do background
        // game.stage.backgroundColor = '#71c5cf';
        var BACKGROUND = game.add.tileSprite(0, 0, 500, 500, "BACKGROUND"); //adiciona a imagem de background

        // Inicia o sistema de fisicas premade arcade
        game.physics.startSystem(Phaser.Physics.ARCADE);

        var escKey = game.input.keyboard.addKey( // Vola ao menu principal
            Phaser.Keyboard.BACKSPACE);
        escKey.onDown.add(listener2, this);




        //PARTE DO PASSARO
        // Mostra o passaro na posicao escolhida
        this.bird = game.add.sprite(100, 245, 'bird');
        // Faz o centro do passaro ser o seu ponto de rotacao nao o canto superior esquerdo
        this.bird.anchor.setTo(-0.2, 0.5);

        // Adiciona as fisicas premade ao passaro (gravidade colisoes etc)
        game.physics.arcade.enable(this.bird);

        // adiciona gravidade ao passaro para o fazer cair
        this.bird.body.gravity.y = 1000;

        // salta ao carregar no espaco
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        //Vars para o som
        this.jumpSound = game.add.audio('jump');
        this.deathSound = game.add.audio('death');
        this.dingSound = game.add.audio('ding');

        //PARTE DAS PIPES ( paredes )
        // Grupo vazio de pipes para mais tarde adicionar varias
        this.pipes = game.add.group();
        this.stars = game.add.group();

        // Cria camadas aleatorias (ver codigo abaixo)
       timer1 = this.timer = game.time.events.loop(1500, this.AdicionaCamadaDePipes, this);
       timer2 = this.timer = game.time.events.loop(1500, this.adicionaEstrelaRandom, this);



        //PARTE DO SCOR
        this.score = -1; //-1 porque o scor faz update sempre que aparece uma nova pipe no ecra , como elas aparecem
        // como elas aparecem todas a mesma distancia o scor faz update(acrescenta +1) exatamente quando passamos pela pipe
        this.labelScore = game.add.text(20, 20,'Score: 0 \nBest: ' + localStorage.getItem("highscore"),
            { font: "30px Arial", fill: "#ffffff" });


    },

    update: function() {
        // Se o passaro sair do escra chama a funcao restartGame e reenicia o jogo
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();


        game.physics.arcade.overlap(
            this.bird, this.pipes, this.PipeAtingida, null, this);   // se o passaro tocar nas pipes chama a function pipeAtingida

        game.physics.arcade.overlap(
            this.bird,this.stars,this.StarAtingida, null, this); // se o passaro tocar nas estrelas chama a function starAtingida

        if (this.bird.angle < 20) // faz o passaro rodar (animacao)
            this.bird.angle += 1;

            //Carrega sprites difrentes para o passaro dependendo do angulo an que este esta
        if(this.bird.angle > -20 && this.bird.angle <= -10){
            this.bird.loadTexture('bird3');
        }

        if(this.bird.angle > -10  && this.bird.angle <= 10){
            this.bird.loadTexture('bird2');
        }

        if(this.bird.angle > 10  && this.bird.angle <= 20){
            this.bird.loadTexture('bird');
        }


        },

    // funcao para o salto
    jump: function() {
        if (this.bird.alive == false) // nao permite saltar caso o passaro morra
            return;

        this.bird.loadTexture('bird4');
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;


        // Cra a animacao do salto para o passaro
        var animation = game.add.tween(this.bird);
// Muda o angulo do passaro para -20 em 100 milisegundos
        animation.to({angle: -20}, 100);
// comeca a animation e da play ao som
        animation.start();
        this.jumpSound.play();




    },

    listener2: function() {

        game.state.start('menu');
    },

// Recomeçar o jogo
    restartGame: function() {
    // esta funcao da rstart ao jogo
        game.state.start('main');
    },

    adicionaPipe: function(x, y) {
        // Crea uma pipe na posicao x , y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Adiciona a pipe ao grupo anterior
        this.pipes.add(pipe);

        // Liga as fisicas premade nessa pipe
        game.physics.arcade.enable(pipe);

        // velocidade para a pipe mover-se para a esquerda
        pipe.body.velocity.x = -200;

        // Quando esta sair fora do ecra e automaticamente detruida
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },



    adicionaEstrela: function(x, y) {
        // Crea uma pipe na posicao x , y
        var star = game.add.sprite(x, y, 'star');

        // Adiciona a estrela ao grupo anterior
        this.stars.add(star);

        // Liga as fisicas premade nessa estrela
        game.physics.arcade.enable(star);

        // velocidade para a estrela mover-se para a esquerda
        star.body.velocity.x = -200;

        // Quando esta sair fora do ecra e automaticamente detruida
        star.checkWorldBounds = true;
        star.outOfBoundsKill = true;

    },

    adicionaEstrelaRandom: function(){
        var test = Math.floor(Math.random() * 5) + 1;// escolhe um numero entre 1 e 5 para a posicao da estrela
        var test2 = Math.floor(Math.random() * 5) + 1;// decide se a estrela vai aparecer ou nao
        if ( test2 > 3){
            this.adicionaEstrela(300, test*60+10);
        }

    },

    AdicionaCamadaDePipes: function() {
        // Escolhe um numero entre 1 e 5 (vai ser aqui que vai ter o buraco)
        var buraco = Math.floor(Math.random() * 5) + 1;

        // Adiciona 6 pipes
        // O buraco fica entre "buraco" e "buraco + 1 " ficando assim 2 lugares vazios onde ficariam pipes
        for (var i = 0; i < 8; i++)
            if (i != buraco && i != buraco + 1)
                this.adicionaPipe(400, i * 60 + 10); // o primeiro i é 0 logo a primeira pipe fica 0+10, o segundo e 1 logo 60(tamanho da pipe) +10 , etc
                  this.score += 1;//Adiciona scor sempre que uma row e adicionada ao ecra
                    if(this.score >= 1){ // faz com que o som so toque quando a segunda pipe for adicionada que e mesmo momento que o passar passa a primeira
                        this.dingSound.play();
                    }
                  if(this.score > localStorage.getItem("highscore")){ // se o scor for maior que o best score guardado faz update ao scor
                      localStorage.setItem("highscore",this.score)
                  }
                    this.labelScore.text = 'Score: ' + this.score + '\nBest: ' + localStorage.getItem("highscore");
    },


    PipeAtingida: function() {
        // Se o passaro ja tiver atingido a pipe nao fazer nada ( o passaro ja esta a cair fora do ecra)
        if (this.bird.alive == false)
            return;

        // Mudar o estado do passaro para morto
        this.bird.alive = false;

        // Previne mais pipes de aparecerem
        game.time.events.remove(timer1);
        game.time.events.remove(timer2);
        this.deathSound.play();
        // muda a velocidade das pipes para 0 para pararem
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
        // o mesmo para as estrelas
        this.stars.forEach(function(s){
            s.body.velocity.x = 0;
        }, this);

    },


    StarAtingida: function() {
        this.stars.removeAll();
        this.score += 5;//Adiciona scor
        if(this.score > localStorage.getItem("highscore")){ // se o scor for maior que o best score guardado faz update ao scor
            localStorage.setItem("highscore",this.score)
        }
        this.labelScore.text = 'Score: ' + this.score + '\nBest: ' + localStorage.getItem("highscore");
    },
};






// Inicia o phaser e cria um ecra 400 por 400
var game = new Phaser.Game(400, 490);

// estado main do jogo
game.state.add('main', mainState);
game.state.add('menu', menuState);

// Inicia o estado main do jogo
game.state.start('menu');

