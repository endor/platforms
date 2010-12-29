describe 'Game'
  before_each
    Game  = exports.Game
    Game.db = {saveDoc: function() {}}
  end
  
  describe 'count'
    describe 'japanese counting'
      it 'should be able to count clean areas'
        // | -  -  -  -  -  -  -  -  - |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // |       w  b                |
        // | -  -  -  -  -  -  -  -  - |
        [0,1,2,3,4,5,6,7,8].forEach(function(number) {
          game.board[2][number] = 1
          game.board[3][number] = 2
        })
        game.passed_by = { user: black._id }
        Game.pass(game, white)
        game.result.white.should.eql(18)
        game.result.black.should.eql(45)
        game.result.difference.should.eql(27)
      end
    end
  end
  
  describe 'prepare'
    describe 'active when user is white'
      it 'should be true if there is no history yet'
        Game.prepare(game, white).active.should.be_true
      end
    
      it 'should be false if the last move was made by white'
        game.history.push({x: 1, y: 1, _id: white._id, color: 'white'})
        Game.prepare(game, white).active.should.be_false
      end
      
      it 'should be true if the last move was made by black'
        game.history.push({x: 1, y: 1, _id: black._id, color: 'black'})
        Game.prepare(game, white).active.should.be_true
      end
    end
  end
end