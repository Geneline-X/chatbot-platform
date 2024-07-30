(function() {
    //@ts-ignore
    window.initializeChatbot = function(chatbotId) {
      const container = document.getElementById('chatbot-container');
      fetch(`/api/get-chatbot?chatbotId=${chatbotId}`)
        .then(response => response.text())
        .then(html => {
           //@ts-ignore
            container.innerHTML = html;
           
        });
    }
  })();
  