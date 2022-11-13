// (function(){
  
    var chat = {
      messageToSend: '',
      messageResponses: [
        'Why did the web developer leave the restaurant? Because of the table layout.',
        'How do you comfort a JavaScript bug? You console it.',
        'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
        'What is the most used language in programming? Profanity.',
        'What is the object-oriented way to become wealthy? Inheritance.',
        'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
      ]},
      $chatHistory,
      $button,
      $textarea,
      $chatHistoryList,

      init = function() {
        cacheDOM();
        bindEvents();
        render();
      },

      cacheDOM = function() {
        $chatHistory = $('.chat-history');
        $button = $('button');
        $textarea = $('#message-to-send');
        $chatHistoryList =  $chatHistory.find('ul');
        console.log('At cache DOM, $chatHistory:', $chatHistory)
      },
      bindEvents = function() {
        $button.on('click', addMessage);
        $textarea.on('keyup', addMessageEnter);
      },
      render = function() {
        scrollToBottom();
        if (chat.messageToSend.trim() !== '') {
          var template = Handlebars.compile( $("#message-template").html());
          var context = { 
            messageOutput: chat.messageToSend,
            time: getCurrentTime()
          };
  
          $chatHistoryList.append(template(context));
          scrollToBottom();
          $textarea.val('');
          
          // responses
          var templateResponse = Handlebars.compile( $("#message-response-template").html());
          var contextResponse = { 
            response: getRandomItem(chat.messageResponses),
            time: getCurrentTime()
          };
          
          setTimeout(function() {
            $chatHistoryList.append(templateResponse(contextResponse));
            this.scrollToBottom();
          }, 1500);
          
        }
        
      },
      
      addMessage = function() {
        chat.messageToSend = $textarea.val()
        render();         
      },
      addMessageEnter = function(event) {
          // enter was pressed
          if (event.keyCode === 13) {
            addMessage();
          }
      },
      scrollToBottom = function() {
        console.log($chatHistory)
         $chatHistory.scrollTop($chatHistory[0].scrollHeight);
      },
      getCurrentTime = function() {
        return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      },
      getRandomItem = function(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
      }

      window.addEventListener("DOMContentLoaded", function() {
        init();
    }, false);
    // var searchFilter = {
    //   options: { valueNames: ['name'] },
    //   init: function() {
    //     // var userList = new List('people-list', this.options);
    //     var noItems = $('<li id="no-items-found">No items found</li>');
        
    //     userList.on('updated', function(list) {
    //       if (list.matchingItems.length === 0) {
    //         $(list.list).append(noItems);
    //       } else {
    //         noItems.detach();
    //       }
    //     });
    //   }
    // };
    
    // searchFilter.init();
    
  // })();
  