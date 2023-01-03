// (function(){

  const URL = "https://2ed0-2607-b400-26-0-f44e-7769-f89d-dc0b.ngrok.io/";

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
      latestMessage = undefined,
      startVisualization = false,

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
          console.log(latestMessage)
          var contextResponse = { 
            response: latestMessage,
            time: getCurrentTime()
          };
          
          setTimeout(function() {
            $chatHistoryList.append(templateResponse(contextResponse));
            this.scrollToBottom();
          }, 1500);
          
        }
        
      },
      
      addMessage = function() {
        message = $textarea.val()
        chat.messageToSend = message
        send(message)
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
      },
      send = function(message) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "message": message
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(URL + "/ask", requestOptions)
          .then(response => response.json())
          .then(result => { latestMessage = result.answer
            startVisualization = result.actions == true
            
           })
          .then(() => {
            render();   
            if(startVisualization){
              document.getElementById("message-to-send").disabled = true;

              document.getElementById("dropdowns").innerHTML = `
              <table>
                <tr>
                  <td><label for="sector">Choose a sector:</label></td>
                  <td>
                    <select name="sector" id="sector">
                      <option value="" selected="selected">Choose a sector</option>
                    </select>
                  </td>
                </tr>
              

                <tr>
                  <td><label for="category">Category:</label></td>
                  <td>
                    <select name="category" id="category">
                      <option value="" selected="selected">Choose a sector first</option>
                    </select>
                  </td>
                </tr>


                <tr>
                  <td><label for="item">Item:</label></td>
                  <td>
                    <select name="item" id="item">
                      <option value="" selected="selected">Choose a category first</option>
                    </select>
                  </td>
                </tr>

              </table>
              <button id="send-button" style="padding: 2% 4%;" onClick="getChartData()">VIZUALIZE</button>`;

              // const newDiv = document.createElement("div");

              // // and give it some content
              // const newContent = document.createTextNode("Hi there and greetings!");
            
              // // add the text node to the newly created div
              // newDiv.appendChild(newContent);
            
              // // add the newly created element and its content into the DOM
              // const currentDiv = document.getElementById("div1");
              // document.body.insertBefore(newDiv, currentDiv);
              var subjectObject = {}

        var subjectSel = document.getElementById("sector");
        var topicSel = document.getElementById("category");
        var chapterSel = document.getElementById("item");
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        fetch(URL+"Sectors", requestOptions)
            .then(function (response) {
                if (response.ok)
                    return response.json();
                return response.text();
            })
            .then(sectors => {
                let sector = ""
                for (let i = 0; i < sectors.length; i++) {
                    sector = sectors[i][0];
                    subjectObject[sector] = {};
                }
                // console.log(" Printing subjectObject below");
                // console.log(subjectObject);
                for (var x in subjectObject) {
                    subjectSel.options[subjectSel.options.length] = new Option(x, x);
                }
            })
            .catch(error => {
                console.error(error);
            });


        subjectSel.onchange = function () {
            //empty Chapters- and Topics- dropdowns
            chapterSel.length = 1;
            topicSel.length = 1;
            //display correct values
            fetch(URL+"Categories?" + new URLSearchParams({
                sector: subjectSel.value,
            }
            ),requestOptions)
                .then(function (response) {
                    if (response.ok)
                        return response.json();
                    return response.text();
                })
                .then(categories => {

                    for (let i = 0; i < categories.length; i++){
                        // console.log(categories[i][0])
                        subjectObject[subjectSel.value][categories[i][0]] = []

                    }
                    // console.log(" Printing subjectObject below");
                    // console.log(subjectObject);
                    for (var y in subjectObject[this.value]) {
                        topicSel.options[topicSel.options.length] = new Option(y, y);
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        }
        topicSel.onchange = function () {
            //empty Chapters dropdown
            chapterSel.length = 1;
            //display correct values
            fetch(URL+"Items?" + new URLSearchParams({
                sector: subjectSel.value,
                category: topicSel.value,
            }
            ),requestOptions)
                .then(function (response) {
                    if (response.ok)
                        return response.json();
                    return response.text();
                })
                .then(items => {

                    for (let i = 0; i < items.length; i++){
                        // console.log(items[i][0])
                        subjectObject[subjectSel.value][topicSel.value].push(items[i][0])
                    }
                    // console.log(" Printing subjectObject below");
                    // console.log(subjectObject);
                    var z = subjectObject[subjectSel.value][this.value];
                    for (var i = 0; i < z.length; i++) {
                        chapterSel.options[chapterSel.options.length] = new Option(z[i], z[i]);
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        }
            }      
          })
          .catch(error => console.log('error', error));
      }

      function getChartData(){
        var requestOptions = {
          method: 'POST',
          // headers: myHeaders,
          // body: raw,
          redirect: 'follow'
        };
        var sectorSel = document.getElementById("sector").value;
        var categorySel = document.getElementById("category").value;
        var itemSel = document.getElementById("item").value;

        if(sectorSel == ''){
            sectorSel = '0'
        }
        if(categorySel == ''){
            categorySel = '0'
        }
        if(itemSel == ''){
            itemSel = '0'
        }

        fetch(URL+"query?" + new URLSearchParams({
        emission_factor: 'co2',
        sector: sectorSel,
        category: categorySel,
        name: itemSel,
    }),requestOptions)
        .then(function (response) {
            if (response.ok)
                return response.json();
            return response.text();
        })
        .then(chartData => {
            // let area = document.getElementById("data");
            let content = ""
            var xa = [];
            var ya = [];
            console.log("we received: ", chartData);
            for (let i = 0; i < chartData.length; i++){
                xa.push(chartData[i][0].toString()) ;
                ya.push(chartData[i][1]) ;

                // content += chartData[i] + "<br><br>";
            }
            // area.innerHTML = content;

            var data = [
            {
                x: xa,
                y: ya,
                name: 'CO2 Emitted (in kg) / US Dollar spent',
                type: 'bar',
                // width: 1
            }
            ];

            var layout = {
              showlegend: true,
              legend: {
                x: 1.08,
                xanchor: 'right',
                y: 1.05,
                name: 'CO2'
              },
              title: {
                    text:'Carbon footprint for different sectors',
                    font: {
                      family: 'poppins',
                      size: 34,
                      weight: 800
                    },
                    xref: 'paper',
                    x: 0.05,
                    },
                    xaxis: {
                    title: {
                      text: 'YEAR',
                      font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f',
                        weight: 800
                      }
                    },
                    autotick: false,
                    ticks: 'outside',
                    tick0: 0
                    },
                    yaxis: {
                    title: {
                      text: 'CO2 EMISSION',
                      font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f',
                        weight: 800
                      },
                      
                    }
                    }
            };

            Plotly.newPlot('infoviz', data);

        })
        .catch(error => {
            console.error(error);
        });
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
  