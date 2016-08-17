import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ChatBubble from '../components/ChatBubble'
import '../interpreter/hasKeyWords'
import '../interpreter/hasKeyPhrases'

import '../sass/_chat.scss'

var messages = {
  intro: function(chat) {
    chat._appendMessage(1, "I'm Brandon – a Toronto based __product designer__. 📱")
    window.setTimeout(() => {
      chat.setState({is_typing: true})
    }, 2000)
    window.setTimeout(() => {
      chat.setState({is_typing: false})
      chat._appendMessage(1, "I started programming in 2012 during my first year\
      in university. Ever since them I've been consumed in building new things and\
      mastering the latest technologies.")
    }, 4000)
    window.setTimeout(() => {
      chat.setState({is_typing: true})
    }, 6000)
    window.setTimeout(() => {
      chat.setState({is_typing: false})
      chat._appendMessage(1, "Right now I'm big on JavaScript and mastering the\
      ReactJS library; using it to build web and iOS apps.")
    }, 8000)
    window.setTimeout(() => {
      chat.setState({is_typing: true})
    }, 10000)
    window.setTimeout(() => {
      chat.setState({is_typing: false})
      chat._appendMessage(1, "I'm currently working at the University of Toronto\
      and am accepting freelance project requests.")
    }, 12000)
  },
  about: function(chat) {
    chat._appendMessage(1, "Well, you might know by now that I'm a software \
    guy. I design and write code, as well as designing and engineering user \
    experiences.")
    window.setTimeout(() => {
      chat.setState({is_typing: true})
    }, 1000)
    window.setTimeout(() => {
      chat.setState({is_typing: false})
      chat._appendMessage(1, "I got my first job in tech as a Front End Developer at __Maclaren McCann__ after completing my second year of __Computer Science__ at the __University of Toronto__.")
    }, 3000)
  }
}

const names = ["brandon", "lindsay", "alex"]
const affirmative = ['sure', 'yes', 'ya', 'okay', 'ok', 'ye', 'yea', 'yeah', 'yup']
const negative = ['no', 'noo', 'nope', 'nop', 'na', 'naw', 'nah', 'pass']

var uhoh_message = "I don't really know what you meant... 🤕"

export default class Chat extends Component {
  constructor() {
    super()
    this.state = {
      conversation_stage: 0,
      is_typing: false,
      messages : [],
      visitor_name: localStorage.getItem('visitor_name')
    }
  }

  componentDidMount() {
    // Get the visitors name
    var visitor_name = localStorage.getItem('visitor_name');

    // Set initial conversation_stage
    if (visitor_name) {
      this.setState({conversation_stage: 99})
    }

    // Start conversation
    var initialMessages = [
      {type:1, message: "Hello"+ (visitor_name ? (' '+visitor_name) : '') +"! ✌🏻"},
    ]

    window.setTimeout(() => {
        this.setState({is_typing: true})
    }, 1000)
    window.setTimeout(() => {
      this.setState({is_typing: false})
      this._appendMessage(1, initialMessages[0].message)
    },2000)

  }

  componentDidUpdate() {
    console.log("updated");
  }

  _scrollToBottom() {
    console.log("scroll to bottom");
    const {chat} = this.refs;
    const scrollHeight = chat.scrollHeight;
    const height = chat.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(chat).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  _renderGroup(messages, index) {
    var group = []

    for (var i = index; messages[i] ? messages[i].type : false; i--) {
      group.push(messages[i])
    }

    var message_nodes = group.reverse().map((curr, index) => {
      return <ChatBubble>{curr.message}</ChatBubble>
    })
    return (
      <div key={Math.random().toString(36)} className="recipient">
        <img src="https://pbs.twimg.com/profile_images/720438386188681217/W3f_2f8W_400x400.jpg"/>
        {message_nodes}
      </div>
    )
  }

  _renderMessages(messages) {
    var message_nodes = messages.map((curr, index) => {

      if (!(messages[index-1] ? messages[index-1].type : false) && curr.type && !(messages[index+1] ? messages[index+1].type : false)) {
        console.log("Single message");
        return (
          <div key={Math.random().toString(36)} className="recipient">
            <img src="https://pbs.twimg.com/profile_images/720438386188681217/W3f_2f8W_400x400.jpg"/>
            <ChatBubble>{curr.message}</ChatBubble>
          </div>
        )
      }
      else if (curr.type && (messages[index-1] ? messages[index-1].type : false) && !(messages[index+1] ? messages[index+1].type : false)) {
        return this._renderGroup(messages, index)
      }

      else if (!curr.type) {
        return (<div key={Math.random().toString(36)}><ChatBubble>{curr.message}</ChatBubble></div>)
      }

    })
    if (this.state.is_typing) {
      message_nodes.push(
        <div key={Math.random().toString(36)} className="recipient">
          <img src="../assets/me.jpg"/>
          <ChatBubble>...</ChatBubble>
        </div>
      )
    }
    return message_nodes
  }

  _appendMessage(type, message) {
    var prevState = this.state
    prevState.messages.push({type: type, message: message})
    this.setState(this.state)
  }

  _popPrevMessage() {
    var prevState = this.state
    prevState.messages.pop()
    this.setState(this.state)
  }

  /**
  * _respond => Parses the message and responds appropriately
  *
  * @param {message} - a message (String) the visitor just sent
  *
  * @return
  */
  _respond(message) {
    console.log("conversation_stage: ", this.state.conversation_stage);
    window.setTimeout(() => {
      this.setState({is_typing: true})
    }, 500)
    window.setTimeout((() => { // wait before sending the next message
      // clear typing animation
      this.setState({is_typing: false})

      // figure out response
      // Finite state automata. Thanks Vassos, CSCB36 wasn't a complete waste of time
      switch (this.state.conversation_stage) {

        // State 0
        // I do not know you're name yet.
        case 0:
          if (!this.state.visitor_name) {
            var timer = 0;
            this._appendMessage(1, "I don't think I've met you before. I'm __Brandon__! And your name is?")
            this.setState({conversation_stage: -1});
            return true
          }
          break;

        // State 1
        // About me
        case 1:
          if (message.hasKeyWords(affirmative)) {
            this._appendMessage(1, "Well, I'm a 22 year old software designer and \
              engineer based in Toronto. I love writing code and designing \
              unique experiences with technology while getting to work with \
              other talented and ambitious people and companies.")
            this._appendMessage(1, "Maybe you're interested in working together on something? I'm currently accepting projects.")
            this.setState({conversation_stage: 2})
          }
          else if (message.hasKeyWords(negative)) {
            this._appendMessage(1, "Oh, well maybe you want to see some of my work?")
            this.setState({conversation_stage: 3})
          }
          else {
            this._appendMessage(1, "I'm not really sure what you mean😕")
          }
          break;

        // State 2
        case 2:
          if (message.hasKeyWords(affirmative)) {
            this._appendMessage(1, "Okay, awesome! Maybe just shoot the real Brandon an email and I'm sure he'd love to help you out.")
          }
          break;

        case 3:
          this._appendMessage(1, <span>You can see a lot of my code on <a href="http://github.com/brandonmowat">GitHub</a> but I also have some live projects too. Would you like to see some of those?</span>)
          break;

        // I know you're name / You've been here before
        case 99:
          this._appendMessage(1, "You're looking good today👌🏻")
          this._appendMessage(1, <span>Would you like to <a>hear about me</a> again or did you need <a>something else</a>?</span>)
          this.setState({conversation_stage: 100})
          break;
        case 100:
          if (message.hasKeyPhrases(['something else'])) {
            this._appendMessage(1, "Okay. Are you looking see some of my code? Or did you need to give me a message?")
            this.setState({conversation_stage: 101})
          } else if (message.hasKeyPhrases(['more', 'more about', 'about', 'you'])) {
            messages.about(this)
          }
          break;

        case 101:
          if (message.hasKeyWords(['message', 'second'])) {
            this._appendMessage(1, <span>I'm pretty easy to talk to. Just send an email to me <a href="mailto:brandonmowat11@gmail.com">here</a>.</span>)
          }
          else {

          }
          break;

        //
        // Get new visitor's name
        case -1:
          if (message.hasKeyWords(['no', 'na', 'nah', 'nop', 'nope'])) {
            this._appendMessage(1, "Dude, it doesn't even need to be your real name...")
            this.setState({conversation_stage: -3})
          } else if (names.includes(message)) {
            localStorage.setItem('visitor_name', message)
            this.setState({visitor_name: message})
            this.setState({conversation_stage: 1})
            this._appendMessage(1, "It's nice to meet you "
              + this.state.visitor_name + "!")
            this._appendMessage(1, "Are you here to learn a little bit about who I am and what I do?")
          }
          else {
            this.setState({visitor_name: message})
            this._appendMessage(1, "Wow, " + message + " is a very unique name! Am I spelling it right?")
            this.setState({conversation_stage: -2})
          }
          break;

        case -2:
          if (message.hasKeyWords(['yes', 'yep', 'ya', 'yea', 'ye', 'yeah', 'yup'])) {
            localStorage.setItem('visitor_name', this.state.visitor_name)
            this._appendMessage(1, "Nice! It's great to meet you " + this.state.visitor_name + "😊")
            this._appendMessage(1, "Are you here to learn a little bit about who I am and what I do?")
            this.setState({conversation_stage: 1})
          }
          else if (message.hasKeyWords(['no', 'nope', 'nah', 'noo'])) {
            this._appendMessage(1, "Sorry. How do you spell it then?")
            this.setState({conversation_stage: -3})
          }
          break

        // Said no to giving me a name twice
        case -3:
          localStorage.setItem('visitor_name', message)
          this.setState({visitor_name: message})
          this._appendMessage(1, "Okay. It's great to meet you " + message + "😊")
          this._appendMessage(1, "Are you here to learn a little bit about who I am and what I do?")
          this.setState({conversation_stage: 1})
        break;
        default:

      } // End of switch

      if (message === 'help') {
        this._appendMessage(1, "Try asking one of these:")
      }

    }), 2000)
      //default:
  }

  _onMessageSubmit(e) {
    e.preventDefault();
    if (!this.refs.message_input.value) {return false}
    // push next chatbubble
    var prevState = this.state
    prevState.messages.push({message: this.refs.message_input.value})
    this.setState(this.state)
    var respondTo = this.refs.message_input.value.toLowerCase()
    this.refs.message_input.value = ""
    // Brandon Responds
    this._respond(respondTo)
  }

  render() {
    window.setTimeout(() => {
      this._scrollToBottom()
    },10)
    return (
      <div>
        <header>
          <div className="header-section">
            <img src="https://pbs.twimg.com/profile_images/720438386188681217/W3f_2f8W_400x400.jpg"/>
          </div>
          <div className="header-section">
            <h1>Brandon Mowat</h1>
          </div>
          <div className="header-section">
            <p>v0.9</p>
          </div>
        </header>

        <div className="chat-history">
          <div ref="chat" className="outer">
            <div className="inner">
              <div className="intro">
                <p style={{color:"#000000"}}>You're chatting with a little bot I made. <br></br>It's like me – but a slightly more human.</p>
                <p style={{marginTop: 20}}>🤖</p>
              </div>
              {this._renderMessages(this.state.messages)}
            </div>
          </div>
        </div>

        <div className="message-input">
          <div className="container">
            <form ref="message_form" onSubmit={this._onMessageSubmit.bind(this)}>
              <input ref="message_input" placeholder="Type a message..."/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
