import React, { Component } from 'react'
import { Comment, ToggleBar } from '../presentation'
import firebase from 'firebase'
import { Base64 } from 'js-base64'

class Widget extends Component {

  constructor() {
    super()
    this.state = {
      showComments: false,
      comments: [],
      firebase: null
    }
  }
  //Lifecycle method used to mount Firebase app
  componentDidMount() {
    const fbApp = firebase.initializeApp({
      apiKey: "AIzaSyA40_ZlE_QqtF4D0ef7220WwAlDjArXKo0",
      authDomain: "react-chat-app-renew.firebaseapp.com",
      databaseURL: "https://react-chat-app-renew.firebaseio.com",
      projectId: "react-chat-app-renew",
      storageBucket: "",
      messagingSenderId: "423758882933"
    })
    this.setState({
      firebase: fbApp
    })
    //Variable holds data reference to Base64 encoding and decoding to move bits and bytes without raw format
    const path = Base64.encode(window.location.href)+'/comments'
    //Reference to comments key in Firebase project. When value changes, snapshot payload is given
    fbApp.database().ref(path).on('value', (snapshot) => {
      //If statement used to prevent bug -- null check
      if (snapshot == null)
        return

        const data = snapshot.val()
        //console.log('comments updated: ' + JSON.stringify(data))
        //New set state enables Firebase to receive data. Old set state commented out to show relocation from local storage to database
        this.setState({
          comments: data.reverse()
        })
    })
  }

  //Function allows user to open comments UI, setState reverses intial state boolean
  toggleComments() {
    console.log('toggle comments:' + this.state.showComments)
    this.setState({
      showComments: !this.state.showComments
    })
  }

  //Function allows user to send comment through enter key
  submitComment(event) {
    //If the enter key is not pressed, don't do anything
    if (event.keyCode != 13)
      return

    const comment = {
      text: event.target.value,
      timestamp: Date.now()
    }
    // const encoded = Base64.encode(window.location.href)
    // console.log('submit comment '+ encoded)
    // console.log('decode '+Base64.decode(encoded))
     let comments = Object.assign([], this.state.comments)
     const path = Base64.encode(window.location.href)+'/comments/'+comments.length //Path reference to Base64 for submit comments
     this.state.firebase.database().ref(path).set(comment) //Grabs FB database and comments key, then appends length of comment

    //this.setState({ //Deprecated local storage state
    //comments: comments
    // })
     event.target.value = '' //Clears user input field after comment submition
  }

  render() {
    //When user clicks comments component, UI will show, otherwise return the component bar
    if(this.state.showComments === true)
      return (
        <div style={style.comments}>
          <div>
            <input onKeyDown={this.submitComment.bind(this)} style={style.input} type='text' placeholder='Enter Comment' />
          </div>
          { this.state.comments.map((comment, i) => {
            return <Comment key={comment.timestamp} {...comment}/>
          })

          }
          <ToggleBar label='Click Here to Close UI' onToggle={this.toggleComments.bind(this)}/>
        </div>
      )

    return(
      <ToggleBar label='Click Here to Display UI' onToggle={this.toggleComments.bind(this)}/>
    )
  }
}

const style = {
  comments: {
    zIndex:100,
    height:100+'%',
    color:"black",
    width:332,
    position:'fixed',
    right:0,
    top:0,
    background:'#f1f9f5',
    borderLeft: '1px solid #ddd',
    overflowY: 'scroll',
    paddingBottom:96,
    fontSize:20
  },
  input: {
    width:100+'%',
    height:36,
    border:'none',
    padding:9,
    fontSize:18,
    borderBottom:'1px solid #ddd'
  }
}


export default Widget
