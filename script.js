$(document).ready(function () {

  // 参加者名のデータをローカルストレージに貯める動作
  // データが空の場合は、空の情報を返す
    let participants = JSON.parse(localStorage.getItem('participants')) || {};
  
  // 解答されない場合にエラーを出すためのブール関数
    let isQuestionAnswered = true;
  

// 参加者リストを更新
function updateParticipantList() {
  $('#participants').empty();

  // participantsオブジェクトの各要素をliに格納
  $.each(participants, function (name, drinks) {
    const listItem = $('<li>').text(name + '  飲んだ数: ');

    const drinksSpan = $('<span>').attr('id', name + '-drinks').text(drinks);
    listItem.append(drinksSpan);

    const orderButton = $('<button>').text('お酒を頼む');

    orderButton.click(function () {
      orderDrink(name);
    });

    // 問題が解答されていない場合はボタンを無効に
    if (!isQuestionAnswered) {
      orderButton.prop('disabled', true);
    }

    listItem.append(orderButton);

    $('#participants').append(listItem);
  });
}

    function addParticipant() {
      const name = $('#participantName').val();
      if (name) {
        participants[name] = (participants[name] || 0);
        localStorage.setItem('participants', JSON.stringify(participants));
        updateParticipantList();
        $('#participantName').val('');
        updateBackgroundImage();
      }
    }
  
    function orderDrink(name) {
      if (!isQuestionAnswered) {
        alert('問題への回答は必須です！');
        return;
      }
      isQuestionAnswered = false;
      participants[name]++;
      localStorage.setItem('participants', JSON.stringify(participants));
      $(`#${name}-drinks`).text(participants[name]);
      generateQuestion(name);
      updateBackgroundImage();
      $('button').not('#submitAnswer').not('#reset').prop('disabled', true);
    }
  
    function generateQuestion(name) {
      let digits = participants[name];
      let numbers = [];
      for (let i = 0; i < digits + 1; i++) {
        numbers.push(Math.floor(Math.random() * Math.pow(10, digits)));
      }
      let questionStr = numbers.join(' + ');
      let answer = numbers.reduce((sum, num) => sum + num, 0);
  
      $('#question').text(questionStr + ' = ?');
      $('#result').empty();
      $('#questionArea').show();
  
      $('#submitAnswer').off('click').click(function () {
        let userAnswer = parseInt($('#answer').val(), 10);
        if (userAnswer === answer) {
          $('#result').text('もう一杯～');
          $('#questionArea').hide();
        } else {
          $('#result').text('もう飲むのはやめなさい！');
        }
        $('#answer').val('');
        isQuestionAnswered = true;
        $('button').not('#submitAnswer').not('#reset').prop('disabled', false);
      });
    }
  
    function updateBackgroundImage() {
      let totalDrinks = Object.values(participants).reduce((sum, num) => sum + num, 0);
      let imageNumber = Math.min(Math.floor(totalDrinks / 5) + 1, 6);
      let imagePath = `img0${imageNumber}.png.png`;
      $('body').css('background-image', `url(${imagePath})`);
    }
  
    $('#register').click(addParticipant);
  
    $('#reset').click(function() {
      localStorage.clear();
      participants = {};
      updateParticipantList();
      updateBackgroundImage();
      $('#questionArea').hide();
      isQuestionAnswered = true;
      $('button').not('#submitAnswer').not('#reset').prop('disabled', false);
    });
  
    updateParticipantList();
    updateBackgroundImage();
  });
  