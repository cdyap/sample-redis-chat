//taken from https://github.com/dwyl/hapi-socketio-redis-chat-example

$( document ).ready(function() {
  var socket = io(); // initialise socket.io connection

  function getName() {
    // prompt for person's name before allowing to post
    var name = Cookies.get('name');
    if(!name || name === 'null') {
      name = window.prompt("What is your name/handle?");
      Cookies.set('name', name);
    }
    
		//TODO: notify server that a new user connected!
    
		$( "#m" ).focus(); // focus cursor on the message input
    return name;
  }

  function leadZero(number) {
    return (number < 10) ? '0'+number : number;
  }

  function getTime(timestamp) {
    var t, h, m, s, time;
    t = new Date(timestamp);
    h = leadZero(t.getHours());
    m = leadZero(t.getMinutes());
    s = leadZero(t.getSeconds());
    return '' + h  + ':' + m + ':' + s;
  }

  /**
   * renders messages to the DOM
   */
  function renderMessage(msg) {
    msg = JSON.parse(msg);
    var html = "<li class='row'>";
    html += "<small class='time'>" + getTime(msg.t)  + " </small>";
    html += "<span class='name'>" + msg.n + ": </span>";
    html += "<span class='msg'>"  + msg.m + "</span>";
    html += "</li>";
    $('#messages').append(html);  // append to list
    return;
  }

  $('form').submit(function() {
    
    //if input is empty or white space do not send message
    if($('#m').val().match(/^[\s]*$/) !== null) { 
      $('#m').val('');
      $('#m').attr('placeholder', 'please enter your message here');
      return false; 
    }
    
    if(!Cookies.get('name') || Cookies.get('name').length < 1 || Cookies.get('name') === 'null') {
      getName();
      return false;
    } else {
      var msg  = $('#m').val();
      
			//TODO: actually send the message to the server!
      
			$('#m').val(''); // clear message form ready for next/new message
      $('#m').attr('placeholder', ''); //clears placeholder once a msg is successfully sent
      return false;
    }
  });

  // keeps latest message at the bottom of the screen
  // http://stackoverflow.com/a/11910887/2870306
  function scrollToBottom () {
    $(window).scrollTop($('#messages').height());
  }

  function showJoiner(name) {
    $('#joiners').show();
    $('#joined').text(name)
    $('#joiners').fadeOut(5000);
  };

  window.onresize = function(){
    scrollToBottom();
  }

	//TODO: handle new chat messages from server

	//TODO: handle new people joining the chat 

	//TODO: load messages
	
	getName(); //register chat name
});
