import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Home from './Home'
import Posts from './Posts'


function App() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  let history = useHistory()

  useEffect(() => {
    fetch('/check_login')
    .then(response => {
      if (response.ok) {
        response.json()
        .then(data => setProfile(data))
      }
    })
  }, [])

  useEffect(() => {
      profile &&
      fetch(`/${profile.username}/posts`)
      .then(response => {
        if (response.ok) {
          response.json()
          .then(data => {setPosts(data)})
        } else{
          setPosts([])
        }
      })
    
    
  }, [profile])

  function attemptLogin(profileInfo) {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json',
      },
      body: JSON.stringify(profileInfo)
    })
      .then((res)=>res.json())
      .then((data) => {
        setProfile(data)
        history.push(`/${data.username}/posts`)
      });
  }

  function addNewPost(newpost) {
    console.log(newpost)
    fetch(`/${profile.username}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newpost)
    })
    .then(res => 
      res.json()
    )
    .then(newData => setPosts([newData, ...posts]))
  }


  function attemptSignup(profileInfo) {
    fetch('/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json',
      },
      body: JSON.stringify(profileInfo),
    })
    .then((res)=>res.json())
    .then((data) => {
      setProfile(data)
      history.push(`/${data.username}/posts`)
    })
  }

  function logout() {
    fetch('/logout', {
      method: 'DELETE'
    })
    .then(res => {if (res.ok) {    
      setProfile(null)
      history.push('/')
    }})
  }


  return (
    <div>
      <Switch>
        <Route path = '/:username/posts'>
          {profile ? (<Posts profile = {profile} logout = {logout} posts = {posts} addNewPost={addNewPost} />) : null}
        </Route>
        <Route exact path = '/'>
          <Home attemptLogin = {attemptLogin} attemptSignup = {attemptSignup} profile = {profile} />
        </Route>
      </Switch>
    </div>
  )
}

export default App;


